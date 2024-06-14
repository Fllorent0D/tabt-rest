import { Injectable, Scope } from '@nestjs/common';
import { filter, Observable, Subject } from 'rxjs';
import {
  TabtEvent,
  TabtEventPayloadTypes,
  TabtEventType,
} from './models/event.model';

@Injectable({ scope: Scope.DEFAULT })
export class EventBusService extends Subject<TabtEvent<TabtEventPayloadTypes>> {
  constructor() {
    super();
  }

  ofTypes<T extends TabtEventPayloadTypes>(
    ...args: TabtEventType[]
  ): Observable<TabtEvent<T>> {
    if (args !== undefined) {
      return this.pipe(
        filter(
          (e: TabtEvent<TabtEventPayloadTypes>): boolean =>
            !!e.type && args.includes(e.type),
        ),
      ) as Observable<TabtEvent<T>>;
    }
    return <Observable<TabtEvent<T>>>super.asObservable();
  }

  emitEvent(events: TabtEvent) {
    this.next(events);
  }
}
