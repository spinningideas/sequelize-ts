/**
 * @summary Promise of Generic result from a given repository operation
 * that allows decoupling from Sequelize Models directly
 * within persistence related methods.
 */

type RepositoryResult<M> = Promise<Result<M | undefined, Error | undefined>>;

/**
 * @summary Generic result for repositories that allows decoupling
 * from Sequelize Models directly within persistence related methods.
 * Returns indicator if the operation was successful in the boolean "success".
 * Returns the actual payload of data in "data".
 * Returns any errors in "errors".
 */
export class Result<V, E> {
  public success: boolean;
  private error: E;
  private data: V;

  private constructor(success: boolean, data: V, error: E) {
    if (success && error) {
      throw new Error("Successful result must not contain an error");
    } else if (!error) {
      throw new Error("Unsuccessful result must contain an error");
    }

    this.success = success;
    this.data = data;
    this.error = error;
  }

  public static ok<V>(data: V): Result<V, undefined> {
    return new Result(true, data, undefined);
  }

  public static fail<E>(error: E): Result<undefined, E> {
    return new Result(false, undefined, error);
  }

  public getError(): E {
    if (!this.error) {
      throw new Error("Result does not contain an error");
    }
    return this.error;
  }

  public getData(): V {
    if (!this.data) {
      throw new Error("Result does not contain data");
    }

    return this.data;
  }
}

export default RepositoryResult;
