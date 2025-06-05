export class BlockedUser {
    constructor(
        public id: number,
        public username: string,
        public blockedDate: Date,
        public reason?: string
    ) {}
} 