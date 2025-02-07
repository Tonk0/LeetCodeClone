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
        ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS Task_Templates (
    id SERIAL PRIMARY KEY,
    template TEXT NOT NULL,
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

Можно предположить, что для каждого набора входных данных существует ***ровно* одно решение**, и вы не можете использовать *один и тот же* элемент дважды.

Ответ можно вернуть в любом порядке.

**Пример 1**
> **Ввод:** nums = [2,7,11,15], target = 9  
> **Вывод:** [0,1]  
> **Объяснение:** Поскольку nums[0] + nums[1] == 9, нужно вернуть [0, 1].

**Пример 2**
> **Ввод:** nums = [3,2,4], target = 6  
> **Вывод:** [1,2]

**Пример 3**
> **Ввод:** nums = [3,3], target = 6  
> **Вывод:** [0,1]
$$,
    NOW()
);

INSERT INTO Test_Cases (task_id, input, expected_output)
VALUES
  (1, '{"nums": [2,7,11,15], "target": 9}'::jsonb, '{"output": [0,1]}'::jsonb),
  (1, '{"nums": [3,2,4], "target": 6}'::jsonb, '{"output": [1,2]}'::jsonb),
  (1, '{"nums": [3,3], "target": 6}'::jsonb, '{"output": [0,1]}'::jsonb);
