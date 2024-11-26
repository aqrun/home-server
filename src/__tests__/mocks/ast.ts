
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
   * age 描述
   */
  age: number = 18;
  isMale: boolean = true;
  objData = {
    a: 1,
    b: 2,
  }

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

