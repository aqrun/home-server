import { classStr } from './mocks/ast';
import { parseClass } from '~/utils/ast';
 
describe('AST解析', () => {
  it('解析类数据', () => {
    const res = parseClass(classStr);
    expect(res.id).toBe('GlobalModel');
    expect(res.description).toBe('test-class');
    expect(res.stores?.[0]?.initValue).toBe('alex');

    const regions = res?.stores?.find((item) => {
      return item?.name === 'regions';
    });
    expect(regions?.type).toBe('array');
  })
})