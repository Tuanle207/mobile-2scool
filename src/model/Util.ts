/**
   * Ultilities Interface
   */
  export namespace Util {
  
    export interface IObject<T = any> { [key: string]: T;}
  
    export interface BaseAction {
      type: string,
      payload?: any
    }
  
    export interface DataError {
      id: string,
      msg: string; 
    }
  
    export interface PagingFilter {
      key: string;
      comparison: string;
      value: string | number | Array<string> | Array<number>;
    }
  
    export interface PagingInfo {
      pageIndex?: number;
      pageSize?: number;
      sortName?: string;
      ascend?: boolean;
      filter?: Array<PagingFilter>;
    }
  
    export interface PagingModel<T> {
      items: Array<T>;
      totalCount: number;
      pageIndex: number;
      pageSize: number; 
    }
  
    export interface IHaveExtraProperties {
      extraProperties: IObject;
    }
  
    export interface DateFilterDto {
      startTime: Date;
      endTime: Date;
    }
  }