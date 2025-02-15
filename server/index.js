const languageConfig = require('./languageConfig')
const createTempFile = require('./helpers/CreateTempFile')
const getTestCases = require('./helpers/GetTestCases')
const getCodeTemplate = require('./helpers/GetCodeTemplate')
const createCodeToRun = require('./helpers/CreateCodeToRun')
const getContainerLogs = require('./helpers/GetContainerLogs')
// const userCode = `
// var twoSum = function(nums, target) {
//   let map = new Map();
//   for (let i = 0; i < nums.length; i++) {
//     if (map.has(target - nums[i])) {
//       return [map.get(target - nums[i]), i]
//     }
//     map.set(nums[i], i);
//   }
// };
// `



// const userCode = `
// vector<int> twoSum(vector<int>& nums, int target) {
//     unordered_map<int, int> numMap;
//     int n = nums.size()

//     for (int i = 0; i < n; i++) {
//         numMap[nums[i]] = i;
//     }

//     for (int i = 0; i < n; i++) {
//         int complement = target - nums[i];
//         if (numMap.count(complement) && numMap[complement] != i) {
//             return {i, numMap[complement]};
//         }
//     }

//     return {};
// }
// `

const userCode = `
a = 5/0
def twoSum(nums, target):
    num_to_index = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_to_index:
            return [num_to_index[complement], i]
        num_to_index[num] = i
    return []
`

async function runContainer(taskID, languageID, userCode) {
  const languageObj = languageConfig[languageID];
  const testCases = await getTestCases(taskID);
  const codeTemplate = await getCodeTemplate(taskID, languageID);
  const codeToRun = createCodeToRun(testCases, codeTemplate, userCode);
  const filePath = await createTempFile(codeToRun, languageObj.extension)
  const container = await languageObj.createContainer(filePath);
  const result = await getContainerLogs(container);
  console.log(result);
}
runContainer(1, 2, userCode);
