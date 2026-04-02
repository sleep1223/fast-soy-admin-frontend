/**
 * Namespace Api
 *
 * All backend api type
 */
declare namespace Api {
  namespace Common {
    /** common params of paginating */
    interface PaginatingCommonParams {
      /** current page number */
      current: number;
      /** page size */
      size: number;
      /** total count */
      total: number;
    }

    /** common params of paginating query list data */
    interface PaginatingQueryRecord<T = any> extends PaginatingCommonParams {
      records: T[];
    }

    /** common search params of table */
    type CommonSearchParams = Pick<Common.PaginatingCommonParams, 'current' | 'size'>;

    /**
     * enable status
     *
     * - "1": enabled
     * - "2": disabled
     */
    type EnableStatus = '1' | '2';

    /** common record */
    type CommonRecord<T = any> = {
      /** record id */
      id: number;
      /** record creator */
      createdBy: string;
      /** record create time */
      createdAt: number;
      /** record updater */
      updatedBy: string;
      /** record update time */
      updatedAt: number;
      /** record status */
      statusType: EnableStatus | null;
      /** record fmt create time */
      fmtCreatedAt: string;
      /** record fmt update time */
      fmtUpdatedAt: string;
    } & T;
  }
}
