import { SchemaDirectiveVisitor } from 'graphql-tools';
import { AuthenticationError } from 'apollo-server-express';
import { defaultFieldResolver } from 'graphql/execution/execute';

class IsAuthenticatedDirective extends SchemaDirectiveVisitor {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitFieldDefinition(field, _) {
    const { resolve } = field;
    field.resolve = async function(...args) {
      const [, , context] = args;

      if (!context.user) {
        throw new AuthenticationError('User is not authenticated.');
      }

      return await resolve.apply(this, args);
    };
  }
}

class UserAwareField extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function(...args) {
      const [_object, , context] = args;
      _object.setRequestUser(context.user);
      args[0] = _object;
      return await resolve.apply(this, args);
    };
  }
}

module.exports = {
  isAuthenticated: IsAuthenticatedDirective,
  userAware: UserAwareField,
};
