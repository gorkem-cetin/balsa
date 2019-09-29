import { User } from './entities/user';
import argon2 from 'argon2';
import { createConnection } from 'typeorm';
import ormconfig from './ormconfig';
import dotenv from 'dotenv';
import { UserConfigurations } from './entities/userConfigurations';

dotenv.config();

createConnection(...ormconfig)
  .then(async connection => {
    const check = await User.findOne({ role: User.ROLE_ADMIN });
    if (check) {
      console.log('A root user already exist.');
      return;
    }
    let user = new User();
    user.firstName = 'Balsa';
    user.lastName = 'Admin';
    user.email = 'root@balsa.com';
    user.password = await argon2.hash('123456');
    user.jobTitle = User.ROLE_ADMIN;
    user.role = User.ROLE_ADMIN;
    user = await user.save();

    const config = new UserConfigurations();
    config.user = user;
    config.save();

    console.log('Root user created successfully. Credentials are:');
    console.log('email: root@balsa.com');
    console.log('password: 123456');
    console.log('Please be sure that you changed the email and password after you logged in.');
  })
  .catch(error => console.log(error));
