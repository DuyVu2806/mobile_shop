import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css";
import { VNumberInput } from 'vuetify/labs/VNumberInput'


// VueQill
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";


const vuetify = createVuetify({
  components: {
    ...components,
    ...directives,
    VNumberInput
  }
});

createApp(App)
  .use(vuetify)
  .use(store)
  .use(router)
  .component("QuillEditor", QuillEditor)
  .mount("#app");
