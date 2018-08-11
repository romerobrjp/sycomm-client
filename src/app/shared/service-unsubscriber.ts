/**
 * Verifica se existe alguma propriedade que possua uma função `unsubscribe` ao chamar o OnDestroy do componente.
 * Caso exista, invoca o `unsubscribe` dessa propriedade, e continua o fluxo do ngOnDestroy original.
 *
 * @example <caption>Subscribe with an Observer</caption>
 *
 * @ServiceUnsubscriber
 * export class ExampleComponent implements OnInit {
 *   public someServiceReference: Subscription;
 *   [...]
 *   ngOnInit() {
 *     this.someServiceReference = someService.subscribe( [...] );
 *   }
 * }
 *
 * @constructor ao chamar sem parenteses, o valor passado é a classe inteira, com todas suas propriedades
 */
export function ServiceUnsubscriber(constructor) {
  const originalOnDestroy = constructor.prototype.ngOnDestroy;

  constructor.prototype.ngOnDestroy = function () {
    for (const prop in this) {
      const property = this[prop];
      if (property && (typeof property.unsubscribe === 'function')) {
        property.unsubscribe();
      }
    }
    originalOnDestroy && typeof originalOnDestroy === 'function' && originalOnDestroy.apply(this, arguments);
  };
}
