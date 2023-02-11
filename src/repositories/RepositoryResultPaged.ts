/**
 * @summary Generic paginated result for repositories that allows decoupling
 * from Sequelize Models directly within persistence related methods.
 * Returns indicator if the operation was successful in the boolean "success".
 * Returns the actual payload of data in "data".
 * Returns any errors in "errors".
 */
export class RepositoryResultPaged<V, E> {
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

  public static ok<V>(data: V): RepositoryResultPaged<V, undefined> {
    return new RepositoryResultPaged(true, data, undefined);
  }

  public static fail<E>(error: E): RepositoryResultPaged<undefined, E> {
    return new RepositoryResultPaged(false, undefined, error);
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

export default RepositoryResultPaged;
