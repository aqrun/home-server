import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import {
  Identifier,
  isStringLiteral,
  isNumericLiteral,
  isBooleanLiteral,
  isObjectExpression,
  isBlockStatement,
  BlockStatement,
} from '@babel/types';

export interface StoreData {
  name: string;
  description?: string;
  type: string;
  initValue?: string;
}

export interface ActionData {
  name: string;
  description?: string;
  actionFunc?: string;
  isAsync?: boolean;
}

export interface ModelData {
  id: string;
  type: string;
  description?: string;
  stores: StoreData[];
  actions: ActionData[];
}

export function parseClass(strData: string): ModelData {
  const res: ModelData = {
    id: '',
    type: 'store',
    description: '',
    stores: [],
    actions: [],
  };

  const ast = parse(strData, {
    sourceType: 'module',
    plugins: ['typescript'],
  });

  // 遍历 AST
  traverse(ast, {
    // 类名解析
    ClassDeclaration(path) {
      // 获取类名
      res.id = path?.node?.id?.name || '';
      // 获取注释
      const comment = trimComment(path?.node?.leadingComments?.[0]?.value?.trim());
      res.description = comment;
    },
    // 属性解析
    ClassProperty(path) {
      // 属性名
      const propertyName = (path?.node?.key as Identifier)?.name || '';
      // 注释
      const comment = trimComment(path?.node?.leadingComments?.[0]?.value?.trim());
      // 值
      let value = '';
      // 值类型
      let valueType = 'string';
      const valueNode = path?.node?.value;

      if (isStringLiteral(valueNode)) {
        value = valueNode?.value;
        valueType = 'string';
      } else if (isNumericLiteral(valueNode)) {
        value = `${valueNode?.value}`;
        valueType = 'number';
      } else if (isBooleanLiteral(valueNode)) {
        value = `${valueNode?.value}`;
        valueType = 'boolean';
      } else if (isObjectExpression(valueNode)) {
        value = generate(valueNode)?.code || '';
        valueType = 'object';
      }

      const storeData: StoreData = {
        name: propertyName,
        type: valueType,
        description: comment,
        initValue: value,
      };
      res.stores.push(storeData);
    },
    // 类方法解析
    ClassMethod(path) {
      const isAsync = path?.node?.async ?? false;
      const name = (path?.node?.key as Identifier)?.name;
      const comment = trimComment(path?.node?.leadingComments?.[0]?.value?.trim());
      const body = parseFuncBodies(path?.node?.body);

      const actionData: ActionData = {
        name: name,
        description: comment,
        actionFunc: body,
        isAsync,
      };
      res.actions.push(actionData);
    },
  });

  console.log('解析后数据', res);
  return res;
}

function trimComment(comment?: string) {
  if (!comment) return '';
  const res = comment?.replace(/\\n/g, '')
    .replace(/\*\s?/g, '')
    .trim();
  return res;
}

/**
 * 方法体解析
 */
function parseFuncBodies(body: BlockStatement) {
  if (isBlockStatement(body)) {
    return body?.body?.map((statement) => {
      return generate(statement)?.code;
    })?.join('\n');
  }

  return '';
}
