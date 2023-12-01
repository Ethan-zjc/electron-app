/**
 * 监听器
 * @param {Object} opt 参数对象
 * @param {String} opt.el 监听元素
 * @param {Object} opt.callback 回调
 * @param {Function} opt.rootMargin 距离多少间距触发
 */
class Observer {
    options: any;
    ob: null;
    constructor(config: any) {
        const defaultOptions = {
            el: '#observer',
            rootMargin: '0px 0px 100px 0px',
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            callback: () => {},
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            error: () => {},
        };

        this.ob = null;
        this.options = Object.assign({}, defaultOptions, config);

        const elem = document.querySelectorAll(this.options.el);
        if (elem.length > 0 && this.isIntersection()) {
            this.initObserve(elem);
        } else {
            this.options.error();
        }
    }

    isIntersection() {
        return typeof IntersectionObserver == 'function';
    }

    initObserve(elem: any[] | NodeListOf<any>) {
        this.clearObserve();
        (this.ob as any) = new IntersectionObserver(
            (entries) => {
                if (entries.length > 0) {
                    entries.forEach((item) => {
                        if (item.isIntersecting) {
                            const data = item.target || {};
                            this.options.callback((data as any).dataset);
                        }
                    });
                }
            },
            {
                rootMargin: this.options.rootMargin,
            }
        );
        elem.forEach((item) => {
            (this.ob as any).observe(item);
        });
    }

    clearObserve() {
        if (this.ob) {
            (this.ob as any).disconnect();
        }
    }
}

export default function (config: any) {
    new Observer(config);
}
