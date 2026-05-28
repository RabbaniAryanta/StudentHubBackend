import { WishlistsModule } from './wishlists/wishlists.module';
import { TagsModule } from './tags/tags.module';
import { StudentsModule } from './students/students.module';
import { RatingsModule } from './ratings/ratings.module';
import { OrdersModule } from './orders/orders.module';
import { MajorsModule } from './majors/majors.module';
import { ContactsModule } from './contacts/contacts.module';
import { CategoriesModule } from './categories/categories.module';
import { BatchesModule } from './batches/batches.module';
import { BankAccountsModule } from './bank-accounts/bank-accounts.module';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { BcryptModule } from './bcrypt/bcrypt.module';
import { ProjectsModule } from './projects/projects.module';

@Module({
  imports: [
    WishlistsModule,
    TagsModule,
    StudentsModule,
    RatingsModule,
    OrdersModule,
    MajorsModule,
    ContactsModule,
    CategoriesModule,
    BatchesModule,
    BankAccountsModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env" }),
    PrismaModule,
    BcryptModule,
    UsersModule,
    MailModule,
    AuthModule,
    ProjectsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
