export default class HttpQueue {
  private requesting: boolean;
  private stack: Array<{
    input: any;
    resolve: any;
    reject: any;
  }>;
  private queryFunction: Function;

  constructor (queryFunction: Function) {
    this.requesting = false;
    this.stack = [];
    this.queryFunction = queryFunction;
  }

  handle({ input }: { input: any }) {
    if (this.stack.length < 2) {
      return new Promise ((resolve, reject) => {
        this.stack.push({
          input,
          resolve,
          reject
        });
        this.makeQuery();
      })
    }
    return new Promise ((resolve, reject) => {
      this.stack[1] = {
        input,
        resolve,
        reject
      };
      this.makeQuery();
    })

  }

  getLength() {
    return this.stack.length;
  } 

  private makeQuery () {
    if (! this.stack.length || this.requesting) {
      return null;
    }

    this.requesting = true;

    this.queryFunction(this.stack[0].input).then((response: any) => {
      this.stack[0].resolve(response);
    }).catch((error: any) => {
      this.stack[0].reject(error);
    }).finally(() => {
      this.requesting = false
      this.stack.splice(0, 1);
      this.makeQuery();
    })
  }
}