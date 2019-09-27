import { User } from '../../entities/user';
import { createConnection } from 'typeorm';

test('Basic CRUD Test', async () => {
  await createConnection('test');

  const user = new User();
  user.firstName = 'Timber';
  user.lastName = 'Saw';
  await user.save();

  const allUsers = await User.find();
  expect(allUsers).toHaveLength(1);

  const firstUser = await User.findOne(1);
  expect(firstUser).toReturn();

  const timber = await User.findOne({ firstName: 'Timber', lastName: 'Saw' });
  expect(timber).toReturn();

  await timber.remove();
  const users = await User.find();
  expect(users).toHaveLength(0);
});
