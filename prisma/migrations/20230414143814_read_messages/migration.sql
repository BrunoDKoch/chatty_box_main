BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[RoleClaims] (
    [id] INT NOT NULL IDENTITY(1,1),
    [roleId] NVARCHAR(450) NOT NULL,
    [claimType] NVARCHAR(max),
    [claimValue] NVARCHAR(max),
    CONSTRAINT [PK_RoleClaims] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Roles] (
    [id] NVARCHAR(450) NOT NULL,
    [name] NVARCHAR(256),
    [normalizedName] NVARCHAR(256),
    [concurrencyStamp] NVARCHAR(max),
    CONSTRAINT [PK_Roles] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[UserClaims] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] NVARCHAR(450) NOT NULL,
    [claimType] NVARCHAR(max),
    [claimValue] NVARCHAR(max),
    CONSTRAINT [PK_UserClaims] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[UserLogins] (
    [loginProvider] NVARCHAR(450) NOT NULL,
    [providerKey] NVARCHAR(450) NOT NULL,
    [providerDisplayName] NVARCHAR(max),
    [userId] NVARCHAR(450) NOT NULL,
    CONSTRAINT [PK_UserLogins] PRIMARY KEY CLUSTERED ([loginProvider],[providerKey])
);

-- CreateTable
CREATE TABLE [dbo].[UserRole] (
    [userId] NVARCHAR(450) NOT NULL,
    [roleId] NVARCHAR(450) NOT NULL,
    CONSTRAINT [PK_UserRoles] PRIMARY KEY CLUSTERED ([userId],[roleId])
);

-- CreateTable
CREATE TABLE [dbo].[Users] (
    [id] NVARCHAR(450) NOT NULL,
    [userName] NVARCHAR(256),
    [normalizedUserName] NVARCHAR(256),
    [email] NVARCHAR(256),
    [normalizedEmail] NVARCHAR(256),
    [emailConfirmed] BIT NOT NULL,
    [passwordHash] NVARCHAR(max),
    [securityStamp] NVARCHAR(max),
    [concurrencyStamp] NVARCHAR(max),
    [phoneNumber] NVARCHAR(max),
    [phoneNumberConfirmed] BIT NOT NULL,
    [twoFactorEnabled] BIT NOT NULL,
    [lockoutEnd] DATETIMEOFFSET,
    [lockoutEnabled] BIT NOT NULL,
    [accessFailedCount] INT NOT NULL,
    CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [IX_Users_Id] UNIQUE NONCLUSTERED ([id]),
    CONSTRAINT [Users_email_key] UNIQUE NONCLUSTERED ([email]),
    CONSTRAINT [Users_normalizedEmail_key] UNIQUE NONCLUSTERED ([normalizedEmail])
);

-- CreateTable
CREATE TABLE [dbo].[UserTokens] (
    [userId] NVARCHAR(450) NOT NULL,
    [loginProvider] NVARCHAR(450) NOT NULL,
    [name] NVARCHAR(450) NOT NULL,
    [value] NVARCHAR(max),
    CONSTRAINT [PK_UserTokens] PRIMARY KEY CLUSTERED ([userId],[loginProvider],[name])
);

-- CreateTable
CREATE TABLE [dbo].[Chat] (
    [id] NVARCHAR(1000) NOT NULL,
    [isGroupChat] BIT NOT NULL CONSTRAINT [Chat_isGroupChat_df] DEFAULT 0,
    [maxUsers] INT NOT NULL CONSTRAINT [Chat_maxUsers_df] DEFAULT 2,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Chat_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Chat_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ChatAdmin] (
    [userId] NVARCHAR(450) NOT NULL,
    [chatId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [ChatAdmin_pkey] PRIMARY KEY CLUSTERED ([userId],[chatId])
);

-- CreateTable
CREATE TABLE [dbo].[Message] (
    [id] NVARCHAR(1000) NOT NULL,
    [sentAt] DATETIME2 NOT NULL CONSTRAINT [Message_sentAt_df] DEFAULT CURRENT_TIMESTAMP,
    [editedAt] DATETIME2 NOT NULL,
    [fromId] NVARCHAR(450) NOT NULL,
    [chatId] NVARCHAR(1000) NOT NULL,
    [text] NVARCHAR(1000) NOT NULL,
    [replyToId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Message_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ClientConnection] (
    [userId] NVARCHAR(450) NOT NULL,
    [connectionId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [ClientConnection_pkey] PRIMARY KEY CLUSTERED ([userId])
);

-- CreateTable
CREATE TABLE [dbo].[ReadMessage] (
    [messageId] NVARCHAR(1000) NOT NULL,
    [userId] NVARCHAR(450) NOT NULL,
    [readAt] DATETIME2 NOT NULL CONSTRAINT [ReadMessage_readAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [ReadMessage_pkey] PRIMARY KEY CLUSTERED ([messageId],[userId])
);

-- CreateTable
CREATE TABLE [dbo].[_friends] (
    [A] NVARCHAR(450) NOT NULL,
    [B] NVARCHAR(450) NOT NULL,
    CONSTRAINT [_friends_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateTable
CREATE TABLE [dbo].[_blocked] (
    [A] NVARCHAR(450) NOT NULL,
    [B] NVARCHAR(450) NOT NULL,
    CONSTRAINT [_blocked_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateTable
CREATE TABLE [dbo].[_ChatToUser] (
    [A] NVARCHAR(1000) NOT NULL,
    [B] NVARCHAR(450) NOT NULL,
    CONSTRAINT [_ChatToUser_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [EmailIndex] ON [dbo].[Users]([normalizedEmail]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [UserNameIndex] ON [dbo].[Users]([normalizedUserName]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_friends_B_index] ON [dbo].[_friends]([B]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_blocked_B_index] ON [dbo].[_blocked]([B]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_ChatToUser_B_index] ON [dbo].[_ChatToUser]([B]);

-- AddForeignKey
ALTER TABLE [dbo].[RoleClaims] ADD CONSTRAINT [FK_RoleClaims_Roles_RoleId] FOREIGN KEY ([roleId]) REFERENCES [dbo].[Roles]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[UserClaims] ADD CONSTRAINT [FK_UserClaims_Users_UserId] FOREIGN KEY ([userId]) REFERENCES [dbo].[Users]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[UserLogins] ADD CONSTRAINT [FK_UserLogins_Users_UserId] FOREIGN KEY ([userId]) REFERENCES [dbo].[Users]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[UserRole] ADD CONSTRAINT [FK_UserRoles_Roles_RoleId] FOREIGN KEY ([roleId]) REFERENCES [dbo].[Roles]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[UserRole] ADD CONSTRAINT [FK_UserRoles_Users_UserId] FOREIGN KEY ([userId]) REFERENCES [dbo].[Users]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[UserTokens] ADD CONSTRAINT [FK_UserTokens_Users_UserId] FOREIGN KEY ([userId]) REFERENCES [dbo].[Users]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ChatAdmin] ADD CONSTRAINT [ChatAdmin_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[Users]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ChatAdmin] ADD CONSTRAINT [ChatAdmin_chatId_fkey] FOREIGN KEY ([chatId]) REFERENCES [dbo].[Chat]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Message] ADD CONSTRAINT [Message_fromId_fkey] FOREIGN KEY ([fromId]) REFERENCES [dbo].[Users]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Message] ADD CONSTRAINT [Message_chatId_fkey] FOREIGN KEY ([chatId]) REFERENCES [dbo].[Chat]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Message] ADD CONSTRAINT [Message_replyToId_fkey] FOREIGN KEY ([replyToId]) REFERENCES [dbo].[Message]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ClientConnection] ADD CONSTRAINT [ClientConnection_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[Users]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ReadMessage] ADD CONSTRAINT [ReadMessage_messageId_fkey] FOREIGN KEY ([messageId]) REFERENCES [dbo].[Message]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ReadMessage] ADD CONSTRAINT [ReadMessage_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[Users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[_friends] ADD CONSTRAINT [_friends_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[Users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[_friends] ADD CONSTRAINT [_friends_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[Users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[_blocked] ADD CONSTRAINT [_blocked_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[Users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[_blocked] ADD CONSTRAINT [_blocked_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[Users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[_ChatToUser] ADD CONSTRAINT [_ChatToUser_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[Chat]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_ChatToUser] ADD CONSTRAINT [_ChatToUser_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[Users]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
