const createJSTempFile = require('./helpers/JS/CreateJSTempFile');
const createCPPTempFile = require('./helpers/CPP/CreateCPPTempFile');
const createCPPContainer = require('./helpers/CPP/CreateCPPContainer');
const createJSContainer = require('./helpers/JS/CreateJSContainer');

const createPythonTempFile = require('./helpers/Python/CreatePythonTempFile');
const createPythonContainer = require('./helpers/Python/CreatePythonContainer');
const getContainerLogs = require('./helpers/GetContainerLogs');
const fs = require('fs');
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



const userCode = `
vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> numMap;
    int n = nums.size()

    for (int i = 0; i < n; i++) {
        numMap[nums[i]] = i;
    }

    for (int i = 0; i < n; i++) {
        int complement = target - nums[i];
        if (numMap.count(complement) && numMap[complement] != i) {
            return {i, numMap[complement]};
        }
    }

    return {};
}
`


// const userCode = `
// def twoSum(nums, target):
//     num_to_index = {}
//     for i, num in enumerate(nums):
//         complement = target - num
//         if complement in num_to_index:
//             return [num_to_index[complement], i]
//         num_to_index[num] = i
//     return []
// `


// async function runContainer() {
//   const filePath = await createJSTempFile(1, 3, userCode);
//   const container = await createJSContainer(filePath);
//   const results = await getContainerLogs(container);
//   fs.unlinkSync(filePath);
//   console.log(results);
//   return results;
// }
// runContainer();



async function runContainer() {
  const filePath = await createCPPTempFile(1, 1, userCode);
  const container = await createCPPContainer(filePath);
  const results = await getContainerLogs(container);
  // fs.unlinkSync(filePath);
  console.log(results)
  return results;
}
runContainer();



// async function runContainer() {
//   const filePath = await createPythonTempFile(1, 2, userCode);
//   const container = await createPythonContainer(filePath);
//   const results = await getContainerLogs(container);
//   fs.unlinkSync(filePath);
//   console.log(results)
//   return results;
// }
// runContainer();