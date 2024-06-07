import { shallowMount } from '@vue/test-utils';
import Estoque from '@/pages/Estoque.vue';

describe('Estoque.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Estoque);
  });

  it('deve adicionar um item ao estoque', async () => {
    wrapper.setData({ newItem: 'item1' });
    await wrapper.find('button.add').trigger('click');
    expect(wrapper.vm.items).toContain('item1');
  });

  it('deve editar um item do estoque', async () => {
    wrapper.setData({ items: ['item1'] });
    wrapper.setData({ editItem: 'item1_edited' });
    await wrapper.find('button.edit').trigger('click');
    expect(wrapper.vm.items).toContain('item1_edited');
  });

  it('deve deletar um item do estoque', async () => {
    wrapper.setData({ items: ['item1'] });
    await wrapper.find('button.delete').trigger('click');
    expect(wrapper.vm.items).not.toContain('item1');
  });

  it('deve listar todos os itens do estoque', () => {
    wrapper.setData({ items: ['item1', 'item2'] });
    expect(wrapper.findAll('li').length).toBe(2);
  });
});
