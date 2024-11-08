import transformer from './convert';

export async function processContent(input: string) {
  console.log('processContent')
  let output = "";
  let flag = "success";
  try {
    output = transformer(input)
  } catch (error) {
    flag = "failure"
    output = '代码转换失败';
    console.log(error)
  }
  return [output, flag];
}
