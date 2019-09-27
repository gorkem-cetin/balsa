import { Strategy as BaseJwtStrategy, ExtractJwt } from 'passport-jwt';
import { User } from '../entities/user';

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'SECRET',
};

export default new BaseJwtStrategy(opts, function(jwtPayload, done) {
  User.findOne({ id: jwtPayload.id }).then(function(user, err) {
    if (err) {
      return done(err, false);
    }
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  });
});
