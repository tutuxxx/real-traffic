import Vue from 'vue';
import index from '../../src/routers/index.vue';

describe('index.vue', () => {
  it('should render correct contents', () => {
    const vm = new Vue({
      template: '<div><index></index></div>',
      components: { index }
    }).$mount();
    expect(vm.$el.querySelector('img')).toBeTruthy();
    expect(vm.$el.querySelector('h4').textContent).toBe('vue模版')
    expect(vm.$el.querySelectorAll('h2').length).toBe(2)
  });
});
