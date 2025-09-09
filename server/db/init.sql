CREATE TABLE IF NOT EXISTS Tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS Test_Cases (
    id SERIAL PRIMARY KEY,
    task_id INTEGER NOT NULL,
    input jsonb NOT NULL,
    expected_output jsonb NOT NULL,
    CONSTRAINT fk_testcases_task FOREIGN KEY (task_id)
        REFERENCES Tasks(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS Task_Tags (
    id SERIAL PRIMARY KEY,
    task_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    CONSTRAINT fk_tasktags_task FOREIGN KEY (task_id)
        REFERENCES Tasks(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_tasktags_tag FOREIGN KEY (tag_id)
        REFERENCES Tags(id)
        ON DELETE CASCADE,
    UNIQUE (task_id, tag_id)
);

CREATE TABLE IF NOT EXISTS Users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL UNIQUE,
    pass_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS Programming_Languages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS Statuses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS Submissions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    task_id INTEGER NOT NULL,
    status_id INTEGER NOT NULL,
    memory_used INTEGER,
    execution_time NUMERIC,
    code TEXT NOT NULL,
    programming_language_id INTEGER NOT NULL,
    submitted_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    error_data TEXT,
    wrong_test_case_id INTEGER,
    user_output TEXT,
    user_log  TEXT,
    CONSTRAINT fk_submissions_user FOREIGN KEY (user_id)
        REFERENCES Users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_submissions_task FOREIGN KEY (task_id)
        REFERENCES Tasks(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_submissions_status FOREIGN KEY (status_id)
        REFERENCES Statuses(id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_submissions_pl FOREIGN KEY (programming_language_id)
        REFERENCES Programming_Languages(id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_submissions_tc FOREIGN KEY (wrong_test_case_id)
        REFERENCES Test_Cases(id)
        ON DELETE RESTRICT
    
);

CREATE TABLE IF NOT EXISTS Task_Templates (
    id SERIAL PRIMARY KEY,
    template TEXT NOT NULL,
    test_case_template TEXT NOT NULL,
    task_id INTEGER NOT NULL,
    programming_language_id INTEGER NOT NULL,
    CONSTRAINT fk_tasktemplates_task FOREIGN KEY (task_id)
        REFERENCES Tasks(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_tasktemplates_pl FOREIGN KEY (programming_language_id)
        REFERENCES Programming_Languages(id)
        ON DELETE RESTRICT,
    UNIQUE (task_id, programming_language_id)
);


INSERT INTO Statuses (name)
VALUES
  ('Accepted'),
  ('Wrong Answer'),
  ('Time Limit Exceeded'),
  ('Runtime Error'),
  ('Memory Limit Exceeded'),
  ('Compilation Error')
ON CONFLICT (name) DO NOTHING;
INSERT INTO Programming_Languages (name)
VALUES
  ('C++'),
  ('Python'),
  ('Java Script')
ON CONFLICT (name) DO NOTHING;

INSERT INTO Tasks (title, description, created_at)
VALUES (
    'Сумма двух',
    $$
Дан массив целых чисел `nums` и целое число `target` верните *индексы двух чисел так, чтобы их сумма равнялась `target`*.

&shy;

Можно предположить, что для каждого набора входных данных существует ***ровно* одно решение**, и вы не можете использовать *один и тот же* элемент дважды.

&shy;

Ответ можно вернуть в любом порядке.

&shy;

**Пример 1**
> **Ввод:** nums = [2,7,11,15], target = 9  
> **Вывод:** [0,1]  
> **Объяснение:** Поскольку nums[0] + nums[1] == 9, нужно вернуть [0, 1].

&shy;

**Пример 2**
> **Ввод:** nums = [3,2,4], target = 6  
> **Вывод:** [1,2]

&shy;

**Пример 3**
> **Ввод:** nums = [3,3], target = 6  
> **Вывод:** [0,1]
$$,
    NOW()
);

INSERT INTO Test_Cases (task_id, input, expected_output)
VALUES
  (1, '{"nums": [2,7,11,15], "target": 9}'::jsonb, '[0,1]'::jsonb),
  (1, '{"nums": [3,2,4], "target": 6}'::jsonb, '[1,2]'::jsonb),
  (1, '{"nums": [3,3], "target": 6}'::jsonb, '[0,1]'::jsonb);

INSERT INTO Task_Templates (template, test_case_template, task_id, programming_language_id)
VALUES (
    $$
var twoSum = function(nums, target) {
  
};
$$,
    $$
const test_cases = {test_cases}
{user_code}
function run_test_case(test_case) {
  const { input } = test_case
  const { nums, target } = input
  const output = twoSum(nums, target)
  return output
}

for (let i = 0; i < test_cases.length; i++) {
  const test_case = test_cases[i];
  const userResult = run_test_case(test_case)
  console.log(JSON.stringify({
    userResult: userResult || null
  }))
}
$$,
1,
3
);

INSERT INTO Task_Templates (template, test_case_template, task_id, programming_language_id)
VALUES (
    $$
vector<int> twoSum(vector<int>& nums, int target) {
    
}
$$,
    $$
#include <iostream>
#include <vector>
#include <string>
#include <nlohmann/json.hpp>

using json = nlohmann::json;
using namespace std;

{user_code}

json run_test_case(const json& test_case) {
    vector<int> nums = test_case["input"]["nums"].get<vector<int>>();
    int target = test_case["input"]["target"].get<int>();
    
    vector<int> output = twoSum(nums, target);
    return output;
}

int main() {
    string input_json = R"({test_cases})";
    
    json test_cases = json::parse(input_json);
    
    for (size_t i = 0; i < test_cases.size(); i++) {
        json test_case = test_cases[i];
        json userResult = run_test_case(test_case);
        
        json output;
        output["userResult"] = userResult;
        
        cout << output.dump() << endl;
    }
    
    return 0;
}
$$,
1,
1
);

INSERT INTO Task_Templates (template, test_case_template, task_id, programming_language_id)
VALUES (
    $$
def twoSum(nums, target):
    
$$,
    $$
import json
test_cases = {test_cases}
{user_code}
def run_test_case(test_case):
    input_data = test_case["input"]
    nums = input_data["nums"]
    target = input_data["target"]
    output = twoSum(nums, target)
    return output

for i, test_case in enumerate(test_cases):
    result = run_test_case(test_case)
    print(json.dumps({
        "userResult": result
    }))
$$,
1,
2
);

INSERT INTO Tags (name)
VALUES
  ('array'), ('hash table'), ('greedy');


INSERT INTO Task_Tags (task_id, tag_id)
VALUES
  (1, 1),
  (1, 2);
INSERT INTO Users (email, username, pass_hash)
VALUES
    ('babaika12@mail.ru', 'Kukyo12', '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2');
INSERT INTO Submissions (user_id, task_id, status_id, memory_used, execution_time, code, programming_language_id, error_data, wrong_test_case_id, user_output, user_log)
VALUES
    (1, 1, 2, 1, 1, 'abc', 1, null, 1, null, null),
    (1, 1, 1, 1, 1, 'cab', 1, null, null, null, null);
