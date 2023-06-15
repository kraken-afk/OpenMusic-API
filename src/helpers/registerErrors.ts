import AuthorizationError from '../errors/AuthorizationError'
import ForbiddenError from '../errors/ForbiddenError'
import InternalServerError from '../errors/InternalServerError'
import InvariantError from '../errors/InvariantError'
import NotFoundError from '../errors/NotFoundError'

export const errors = [
  AuthorizationError,
  ForbiddenError,
  InternalServerError,
  InvariantError,
  NotFoundError
]
