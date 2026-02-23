import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createClerkClient, verifyToken } from '@clerk/backend';
import { FastifyRequest } from 'fastify';
import { PrismaService } from '../prisma/prisma.service';
type AuthUser = {
  userId: string;
};

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<FastifyRequest & { user?: AuthUser }>();
    const authHeader = request.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : undefined;

    if (!token) {
      throw new UnauthorizedException('Token não encontrado');
    }

    const secretKey = process.env.CLERK_SECRET_KEY;
    if (!secretKey) {
      throw new UnauthorizedException('Configuração de autenticação ausente');
    }

    try {
      const authorizedPartiesEnv = process.env.CLERK_AUTHORIZED_PARTIES;
      const authorizedParties = authorizedPartiesEnv
        ? authorizedPartiesEnv
            .split(',')
            .map((value) => value.trim())
            .filter(Boolean)
        : process.env.NODE_ENV === 'production'
          ? undefined
          : ['http://localhost:3000'];

      const payload = (await verifyToken(token, {
        secretKey,
        ...(authorizedParties?.length ? { authorizedParties } : {}),
      })) as { sub: string };

      const clerkClient = createClerkClient({ secretKey });
      const clerkUser = await clerkClient.users.getUser(payload.sub);
      const primaryEmail =
        clerkUser.emailAddresses.find(
          (email) => email.id === clerkUser.primaryEmailAddressId,
        )?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress;

      if (!primaryEmail) {
        throw new UnauthorizedException('Email não encontrado');
      }

      const name = [clerkUser.firstName, clerkUser.lastName]
        .filter(Boolean)
        .join(' ')
        .trim();

      const user = await this.prismaService.user.upsert({
        where: { clerkId: payload.sub },
        create: {
          clerkId: payload.sub,
          email: primaryEmail,
          name: name.length ? name : (clerkUser.username ?? null),
        },
        update: {
          email: primaryEmail,
          name: name.length ? name : (clerkUser.username ?? null),
        },
      });

      request.user = {
        userId: user.id,
      };

      return true;
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'Token inválido';
      throw new UnauthorizedException(message);
    }
  }
}
