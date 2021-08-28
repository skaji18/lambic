import VueRouter, {Route} from 'vue-router';
import * as Vuex from 'vuex'
import * as Store from 'store'

declare module '*.vue' {
    import Vue from 'vue'
    export default Vue
}

// Expansion
declare module 'vue/types/vue' {
  interface Vue {
    $router: VueRouter,
    $route: Route,
    $store: Vuex.Store<any>,
    $state: Store.State
  }
}
