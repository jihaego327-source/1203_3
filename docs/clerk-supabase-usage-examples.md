# Clerk + Supabase 사용 예시

이 문서는 Clerk와 Supabase를 통합한 프로젝트에서 실제로 사용할 수 있는 코드 예시를 제공합니다.

## 목차

1. [Client Component 예시](#client-component-예시)
2. [Server Component 예시](#server-component-예시)
3. [Server Action 예시](#server-action-예시)
4. [API Route 예시](#api-route-예시)
5. [실전 예제: 할 일 목록 앱](#실전-예제-할-일-목록-앱)

## Client Component 예시

### 기본 데이터 조회

```tsx
'use client';

import { useClerkSupabaseClient } from '@/lib/supabase/clerk-client';
import { useEffect, useState } from 'react';
import { SignedIn, SignedOut } from '@clerk/nextjs';

export default function TasksList() {
  const supabase = useClerkSupabaseClient();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTasks() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          setError(error.message);
          return;
        }

        setTasks(data || []);
      } catch (err) {
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, [supabase]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div className="text-red-500">오류: {error}</div>;
  }

  return (
    <div>
      <h2>할 일 목록</h2>
      <SignedIn>
        {tasks.length === 0 ? (
          <p>할 일이 없습니다.</p>
        ) : (
          <ul>
            {tasks.map((task) => (
              <li key={task.id}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  readOnly
                />
                <span>{task.name}</span>
              </li>
            ))}
          </ul>
        )}
      </SignedIn>
      <SignedOut>
        <p>로그인이 필요합니다.</p>
      </SignedOut>
    </div>
  );
}
```

### 데이터 생성 (INSERT)

```tsx
'use client';

import { useClerkSupabaseClient } from '@/lib/supabase/clerk-client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateTaskForm() {
  const supabase = useClerkSupabaseClient();
  const router = useRouter();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('할 일을 입력하세요.');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from('tasks')
        .insert({
          name: name.trim(),
          completed: false,
        });

      if (error) {
        throw error;
      }

      // 성공 시 폼 초기화 및 새로고침
      setName('');
      router.refresh();
    } catch (err: any) {
      alert(`오류: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="할 일을 입력하세요"
        disabled={loading}
      />
      <button type="submit" disabled={loading}>
        {loading ? '추가 중...' : '추가'}
      </button>
    </form>
  );
}
```

### 데이터 업데이트 (UPDATE)

```tsx
'use client';

import { useClerkSupabaseClient } from '@/lib/supabase/clerk-client';
import { useState } from 'react';

interface Task {
  id: string;
  name: string;
  completed: boolean;
}

export default function TaskItem({ task }: { task: Task }) {
  const supabase = useClerkSupabaseClient();
  const [completed, setCompleted] = useState(task.completed);
  const [updating, setUpdating] = useState(false);

  async function toggleComplete() {
    try {
      setUpdating(true);
      const { error } = await supabase
        .from('tasks')
        .update({ completed: !completed })
        .eq('id', task.id);

      if (error) {
        throw error;
      }

      setCompleted(!completed);
    } catch (err: any) {
      alert(`오류: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div>
      <input
        type="checkbox"
        checked={completed}
        onChange={toggleComplete}
        disabled={updating}
      />
      <span style={{ textDecoration: completed ? 'line-through' : 'none' }}>
        {task.name}
      </span>
    </div>
  );
}
```

## Server Component 예시

### 서버 사이드 데이터 조회

```tsx
import { createClerkSupabaseClient } from '@/lib/supabase/server';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function TasksPage() {
  // 인증 확인
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  // Supabase 클라이언트 생성 및 데이터 조회
  const supabase = createClerkSupabaseClient();
  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`데이터를 불러올 수 없습니다: ${error.message}`);
  }

  return (
    <div>
      <h1>할 일 목록</h1>
      {tasks && tasks.length > 0 ? (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <input type="checkbox" checked={task.completed} readOnly />
              <span>{task.name}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>할 일이 없습니다.</p>
      )}
    </div>
  );
}
```

## Server Action 예시

### Server Action으로 데이터 생성

```tsx
// app/actions/tasks.ts
'use server';

import { createClerkSupabaseClient } from '@/lib/supabase/server';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export async function createTask(name: string) {
  // 인증 확인
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('로그인이 필요합니다.');
  }

  // Supabase 클라이언트 생성 및 데이터 삽입
  const supabase = createClerkSupabaseClient();
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      name: name.trim(),
      completed: false,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`할 일을 추가할 수 없습니다: ${error.message}`);
  }

  // 페이지 캐시 재검증
  revalidatePath('/tasks');
  
  return data;
}

export async function updateTask(id: string, completed: boolean) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('로그인이 필요합니다.');
  }

  const supabase = createClerkSupabaseClient();
  const { error } = await supabase
    .from('tasks')
    .update({ completed })
    .eq('id', id);

  if (error) {
    throw new Error(`할 일을 업데이트할 수 없습니다: ${error.message}`);
  }

  revalidatePath('/tasks');
}

export async function deleteTask(id: string) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('로그인이 필요합니다.');
  }

  const supabase = createClerkSupabaseClient();
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`할 일을 삭제할 수 없습니다: ${error.message}`);
  }

  revalidatePath('/tasks');
}
```

### Server Action 사용하기

```tsx
// app/tasks/page.tsx
'use client';

import { createTask, updateTask, deleteTask } from '@/app/actions/tasks';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TasksPageClient() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      setLoading(true);
      await createTask(name);
      setName('');
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="할 일을 입력하세요"
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          추가
        </button>
      </form>
    </div>
  );
}
```

## API Route 예시

### REST API 엔드포인트 생성

```tsx
// app/api/tasks/route.ts
import { createClerkSupabaseClient } from '@/lib/supabase/server';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// GET: 할 일 목록 조회
export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const supabase = createClerkSupabaseClient();
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ tasks: data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// POST: 새 할 일 생성
export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: '할 일 이름이 필요합니다.' },
        { status: 400 }
      );
    }

    const supabase = createClerkSupabaseClient();
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        name: name.trim(),
        completed: false,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ task: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

## 실전 예제: 할 일 목록 앱

완전한 할 일 목록 앱 예제입니다.

### 1. 데이터베이스 스키마

```sql
-- tasks 테이블 생성
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS 활성화
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- 정책 생성
CREATE POLICY "Users can view their own tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (auth.jwt()->>'sub' = user_id);

CREATE POLICY "Users can insert their own tasks"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt()->>'sub' = user_id);

CREATE POLICY "Users can update their own tasks"
  ON tasks FOR UPDATE
  TO authenticated
  USING (auth.jwt()->>'sub' = user_id)
  WITH CHECK (auth.jwt()->>'sub' = user_id);

CREATE POLICY "Users can delete their own tasks"
  ON tasks FOR DELETE
  TO authenticated
  USING (auth.jwt()->>'sub' = user_id);
```

### 2. Server Actions

```tsx
// app/actions/tasks.ts
'use server';

import { createClerkSupabaseClient } from '@/lib/supabase/server';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export async function getTasks() {
  const { userId } = await auth();
  
  if (!userId) {
    return [];
  }

  const supabase = createClerkSupabaseClient();
  const { data } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });

  return data || [];
}

export async function createTask(name: string) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('로그인이 필요합니다.');
  }

  const supabase = createClerkSupabaseClient();
  const { data, error } = await supabase
    .from('tasks')
    .insert({ name: name.trim() })
    .select()
    .single();

  if (error) throw error;
  
  revalidatePath('/tasks');
  return data;
}

export async function toggleTask(id: string, completed: boolean) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('로그인이 필요합니다.');
  }

  const supabase = createClerkSupabaseClient();
  const { error } = await supabase
    .from('tasks')
    .update({ completed })
    .eq('id', id);

  if (error) throw error;
  
  revalidatePath('/tasks');
}

export async function deleteTask(id: string) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('로그인이 필요합니다.');
  }

  const supabase = createClerkSupabaseClient();
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);

  if (error) throw error;
  
  revalidatePath('/tasks');
}
```

### 3. 페이지 컴포넌트

```tsx
// app/tasks/page.tsx
import { getTasks } from '@/app/actions/tasks';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import TasksClient from './tasks-client';

export default async function TasksPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  const tasks = await getTasks();

  return <TasksClient initialTasks={tasks} />;
}
```

### 4. 클라이언트 컴포넌트

```tsx
// app/tasks/tasks-client.tsx
'use client';

import { createTask, toggleTask, deleteTask } from '@/app/actions/tasks';
import { useState, useTransition } from 'react';

interface Task {
  id: string;
  name: string;
  completed: boolean;
}

export default function TasksClient({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [name, setName] = useState('');
  const [isPending, startTransition] = useTransition();

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    
    if (!name.trim()) return;

    startTransition(async () => {
      try {
        const newTask = await createTask(name);
        setTasks([newTask, ...tasks]);
        setName('');
      } catch (err: any) {
        alert(err.message);
      }
    });
  }

  async function handleToggle(id: string, completed: boolean) {
    startTransition(async () => {
      try {
        await toggleTask(id, !completed);
        setTasks(tasks.map(t => 
          t.id === id ? { ...t, completed: !completed } : t
        ));
      } catch (err: any) {
        alert(err.message);
      }
    });
  }

  async function handleDelete(id: string) {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    startTransition(async () => {
      try {
        await deleteTask(id);
        setTasks(tasks.filter(t => t.id !== id));
      } catch (err: any) {
        alert(err.message);
      }
    });
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">할 일 목록</h1>
      
      <form onSubmit={handleCreate} className="mb-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="할 일을 입력하세요"
          disabled={isPending}
          className="border p-2 mr-2"
        />
        <button
          type="submit"
          disabled={isPending}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          추가
        </button>
      </form>

      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggle(task.id, task.completed)}
              disabled={isPending}
            />
            <span
              style={{
                textDecoration: task.completed ? 'line-through' : 'none',
              }}
            >
              {task.name}
            </span>
            <button
              onClick={() => handleDelete(task.id)}
              disabled={isPending}
              className="text-red-500"
            >
              삭제
            </button>
          </li>
        ))}
      </ul>

      {tasks.length === 0 && (
        <p className="text-gray-500">할 일이 없습니다.</p>
      )}
    </div>
  );
}
```

## 추가 팁

### 1. 에러 처리

항상 에러를 적절히 처리하세요:

```tsx
try {
  const { data, error } = await supabase.from('tasks').select('*');
  
  if (error) {
    // Supabase 에러 처리
    console.error('Supabase error:', error);
    throw new Error(error.message);
  }
  
  return data;
} catch (err) {
  // 일반 에러 처리
  console.error('Unexpected error:', err);
  throw err;
}
```

### 2. 로딩 상태 관리

사용자 경험을 위해 로딩 상태를 표시하세요:

```tsx
const [loading, setLoading] = useState(true);

useEffect(() => {
  async function fetchData() {
    setLoading(true);
    // 데이터 조회
    setLoading(false);
  }
  fetchData();
}, []);
```

### 3. 실시간 업데이트 (선택사항)

Supabase Realtime을 사용하여 실시간 업데이트를 받을 수 있습니다:

```tsx
useEffect(() => {
  const channel = supabase
    .channel('tasks')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'tasks' },
      (payload) => {
        console.log('Change received!', payload);
        // UI 업데이트
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [supabase]);
```

## 참고 자료

- [Clerk Supabase 통합 가이드](./clerk-supabase-integration.md)
- [Supabase JavaScript Client 문서](https://supabase.com/docs/reference/javascript/introduction)
- [Next.js Server Actions 문서](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)

