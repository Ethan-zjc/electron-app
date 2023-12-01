import { createApp } from 'vue';
import Toast from '../components/Toast.vue';

interface OptionsType {
    title: string;
    type?: string;
    position?: string;
    duration?: number;
}

let rootNode: any = null;
let app: any = null;
const miniToast = (options?: OptionsType) => {
    const dom = document.body.querySelector('.mini-toast');
    if (!dom) {
        rootNode = document.createElement('div');
        rootNode.className = 'mini-toast';
        document.body.appendChild(rootNode);
    } else {
        app.unmount();
    }
    app = createApp(Toast, {
        ...options,
        close() {
            app.unmount();
            document.body.removeChild(rootNode);
        },
    });
    return app.mount(rootNode);
};

miniToast.show = (options: OptionsType) => miniToast(options).show();
miniToast.hide = () => miniToast().hide();

export default miniToast;
