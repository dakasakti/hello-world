import { PrismaClient } from "@prisma/client"
import { Injectable, OnModuleInit, OnModuleDestroy, BeforeApplicationShutdown } from "@nestjs/common"

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy, BeforeApplicationShutdown {
    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }

    async beforeApplicationShutdown(signal: string) {
        console.log(`Received shutdown signal: ${signal}`);
        await this.$disconnect();
    }
}