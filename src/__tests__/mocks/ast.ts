
export const classStr = `
/**
 * test-class
 */
class GlobalModel {
  /**
   * name 描述
   */
  name: string = 'alex';
  /**
   * 两行的
   * age 描述
   */
  age: number = 18;
  // 就是个
  // 男的
  isMale: boolean = true;
  objData = {
    a: 1,
    b: 2,
  }
  regions: array = [1,2,3];

  /**
   * 测试描述
   */
  async getName() {
    const a = 3;
    return a;
  }

  getAge() {

  }
}
`;

