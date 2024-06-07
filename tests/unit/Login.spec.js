import { shallowMount } from '@vue/test-utils';
import Login from '@/pages/Login.vue';

describe('Login.vue', () => {
  it('deve fazer login com credenciais corretas', async () => {
    const wrapper = shallowMount(Login);
    wrapper.setData({ username: 'user', password: 'password' });
    await wrapper.find('button.login').trigger('click');
    expect(wrapper.vm.isLoggedIn).toBe(true);
  });

  it('não deve fazer login com credenciais incorretas', async () => {
    const wrapper = shallowMount(Login);
    wrapper.setData({ username: 'wrong', password: 'wrong' });
    await wrapper.find('button.login').trigger('click');
    expect(wrapper.vm.isLoggedIn).toBe(false);
  });
});
