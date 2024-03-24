---
title: Dinning Philosopher Problem(Multithread & MultiProcess)
date: 2023-03-08 14:00:00 +0900
categories: [42seoul]
tags: [42seoul]
image:
  path: /assets/img/blog/philosopher.png
  lqip: data:image/webp;base64,UklGRpoAAABXRUJQVlA4WAoAAAAQAAAADwAABwAAQUxQSDIAAAARL0AmbZurmr57yyIiqE8oiG0bejIYEQTgqiDA9vqnsUSI6H+oAERp2HZ65qP/VIAWAFZQOCBCAAAA8AEAnQEqEAAIAAVAfCWkAALp8sF8rgRgAP7o9FDvMCkMde9PK7euH5M1m6VWoDXf2FkP3BqV0ZYbO6NA/VFIAAAA
  alt: Dining philosopher
---

# 주제 소개
안녕하세요. 

이번에는 Dining philosopher problem이라고 알려진 문제를 실제로 코드를 이용해서 해결하는 과정을 담은 글입니다.

이 문제를 mutex를 활용한 multithread와 semaphore를 활용한 multiprocess 두 가지를 통해 해결해보며
실제로 multithreading/multiprocessing이 어떻게 일어나는지와 유의할 것이 무엇인지에 대해 배우게되었습니다.

# 구현 영상
{% include embed/youtube.html id='9y6TwNnd0m0' %}

# 본문
### 목차
이번 글은 문제에 대한 소개를 드린 후 간단하게 개념을 정리합니다. 그 후 multithreading/multiprocessing을 통한 문제 해결 과정을 소개해드리려고 합니다.

1. 필요 개념 정리(thread, process, multithread, multiprocess)
1. 문제 소개
1. Mutex를 이용한 Multithread
1. 문제 해결
1. Semaphore를 이용한 multiprocess
1. 추가 프로젝트(python async, 비동기랑 다른건가)


<h3 id="개념 소개">1. 필요 개념 소개</h3>
지금까지는 한 개의 프로그램을 실행시켰을 때 순차적으로 코드를 실행하며 한 순간에 하나의 일만을 처리했습니다. 그런데 만약에 일들을 동시에 처리해야하는 상황이 발생하면 어떻게 해야할까요?

제 경험으로는 이런 일이 있었습니다. 국토교통부 api를 이용해서 공동주택에 대한 정보들을 모아야했는데 전체 데이터수가 17만개쯤 되면 한번의 api호출로 받을 수 있는 정보는 천개뿐인 것이었습니다. 그래서 api를 매우 많이 호출해야했는데 문제는 한번의 호출에 걸리는 시간이 1~10초 정도로 들쑥날쑥이었고 그냥 기다리면서 api를 몇백번 호출하려고 해도 한번 요청에 실패하면 에러가 나면서 프로그램이 중지되어 뒤의 요청이 이뤄지지않았습니다.

저는 이 문제를 여러 api 요청을 한번에 보내고 처리하는 방법을 이용하여 해결하였습니다. 그래서 한 api 요청이 늦어지거나 실패해도 뒤의 api 요청에 영향이 없도록 하였습니다.

그렇다면 이렇게 여러가지 일을 동시에 하는 것이 가능했을까요? 그 방법에 대해 알기 위해서 먼저 프로세스와 스레드에 대해 알 필요가 있습니다.

### 1.1 프로세스
<a href="https://en.wikipedia.org/wiki/Process_(computing)">Wikipedia(Process)</a>에 따르면 **프로세스**는 하나 또는 여러개의 `스레드`에 의해 실행되는 `컴퓨터 프로그램`의 인스턴스라고 합니다. `스레드`에 대한 얘기는 잠시 미뤄두고 컴퓨터 프로그램이 무엇인지 알아볼까요?

<a href="https://en.wikipedia.org/wiki/Computer_program">Wikipedia(Computer Program)</a>를 읽어보면 컴퓨터 프로그램이란 컴퓨터가 실행할 instruction들의 집합이라는 것을 알 수 있습니다. 여기서 instruction은 우리의 소스코드가 빌드되어 만들어진 기계어일테니 컴퓨터 프로그램이란 우리의 실행 파일로 생각할 수 있겠습니다.

그렇다면 **프로세스는 실행 파일의 인스턴스**라고 볼 수 있습니다. 그럼 실행 파일은 어떻게 인스턴스화되는 것일까요? 우리가 실행 파일을 돌리게 되면 OS는 실행할 코드와 정적 데이터들을 메모리에 올리게됩니다. 그 후 stack과 heap 영역을 위한 메모리를 추가로 할당합니다. 그 외에 I/O관련 초기화를 하게되면 프로그램이 실행될 준비가 끝나고 프로세스가 만들어진 것입니다.

<!-- ![img-description](/assets/img/blog/memoryLayout.png) -->

그런데 이렇게 프로세스가 대충 실행할 코드들과 여러 메모리 공간들로 구성되었다는 것은 알겠는데 이게 어떻게 실행되는 걸까요? 이제 스레드에 대해 알아볼 때가 된 것 같습니다.

### 1.2 스레드

스레드는 프로세스 내에 존재하는 하나의 구조체로 생각할 수 있는데 여기 안에는 program counter라는 정보가 존재합니다. Program counter는 cpu가 어떤 코드를 실행해야할지 가리키는 역할을 합니다. 그러니까 스레드를 통해서 그 프로그램의 어떤 부분을 실행시켜야할 지 알 수 있는 것이고 스레드가 프로그램을 실행시키는 것이죠.

이제 처음에 봤던 프로세스의 정의가 이해가 됩니다. 프로세스는 컴퓨터 프로그램의 인스턴스이고 이걸 실행시키는 것은 스레드였습니다. 

그런데 약간 이해가 안가는 부분이 있습니다. 분명 아까 정의에서 '하나 또는 여러개의 스레드'라는 부분이 있었습니다. 지금까지 설명한 것으로 보면 스레드를 통해 코드를 하나하나 실행하는 것이니 스레드는 하나만 있으면 되겠고 순차적으로 우리의 코드를 실행해나가면  되지 않나 싶습니다. 

그런데 그러면 우리는 카카오톡을 쓸 수 없습니다.

### 1.3 멀티스레딩

친구들과 약속이 끝나고 집에 가는 길을 생각해봅시다. 단톡방에 오늘 찍은 사진도 올라오고 친구들이 여러 얘기들도 합니다. 여러분도 카톡을 보내고 있고요. 그런데 이 당연한 것들이 생각해보면 약간 신기합니다. 여러분은 분명 친구들이 올린 사진을 다운로드 받고 있는데 카톡도 정상적으로 오고가고있습니다. 여러 일들이 동시에 일어나고 있는 것이죠. 카카오톡이라는 프로세스에 스레드가 하나만 있다면 이렇게 여러 일들을 동시에 처리하는 것은 어려울 것입니다. 그래서 우리는 각각의 일에 스레드를 하나씩 사용하기로 하였습니다. 1번 스레드는 사진을 다운로드하는 부분의 코드를 실행하고 2번 스레드는 카카오톡을 주고받는 부분의 코드를 실행하도록 하는 것이죠.

이렇게 여러 개의 스레드를 쓰는 것을 우리는 멀티스레딩이라고 합니다. 이걸 통해서 우리는 하나의 프로그램 안에서 동시에 여러가지 일들을 할 수 있으니 정말 좋죠. 그런데 이렇게 멀티스레딩을 쓸 때 가끔 문제점이 발생할 수 있습니다. 

아시다시피 프로세스에는 힙, 스택, 데이터 영역이 있습니다. 그런데 스레드들은 프로세스 안에 있기때문에 이 데이터 영역과 힙 영역을 공유합니다. 뭔갈 공유한다는 것부터 벌써 안좋은 느낌이 들지만 공유한다는 것은 자원을 복사하지 않고 아낄 수 있게 해주기도 합니다. 아무튼 만약 `increaseAndPrint()`라는 함수가 있어서 힙 영역에 있는 `int x`의 값을 증가시키고 프린트하는 함수가 있다고 생각해봅시다. 만약 두 스레드가 동시에 이 함수를 불렀고, 한 스레드가 값을 올리기만하고 출력하기 전에 다른 스레드가 x의 값을 올려버린다면 두 스레드 모두 원래 x값에 +2된 값을 출력하게 될 것입니다. 의도와 다른 결과가 나와버린 것이죠.

이런 상황은 멀티스레딩을 할 때 주의가 필요한 부분이라 각각을 부르는 명칭이 이미 있습니다. `increaseAndPrint()`와 같은 함수는 스레드들이 모두 접근할 수 있는 공유 영역을 건드리는 코드죠. 이런 코드를 우리는 `임계구역(critical section)`이라고 부릅니다. 그리고 방금 말씀드린 것처럼 여러 스레드가 임계구역에 진입해서 의도치않은 결과가 나오는 상황을 `데이터 레이스(data race)`가 발생했다고 합니다.

### 1.4 상호 배제

그럼 이런 데이터 레이스를 막기 위해서 어떤 방법을 쓸 수 있을까요? 바로 상호 배제(Mutex, mutual exclusion)이라는 방법이 있습니다. 말그대로 한 스레드가 임계구역에 진입했을 때에는, 즉 increaseAndPrint()같은 함수를 사용할 때에는, 다른 스레드는 그 임계구역에 진입하지 못하도록 막는 방법이죠. 간단하게 소개해드리자면 프로그램 내에 mutex 변수를 선언합니다. 

```c
pthread_mutex_t	mutex;

pthread_mutex_init(&mutex, 0);
```

참고로 mutex 변수는 다음과 같이 생겼습니다

```c
struct mutex {
        atomic_t                count;
        spinlock_t              wait_lock;
        struct list_head        wait_list;
}
```

이 mutex 변수는 lock과 unlock이 가능한데 mutex.count값이 1이면 unlock, 0이면 lock상태입니다. 그리고 lock/unlock은 아래의 함수를 통해 가능합니다.

```c
pthread_mutex_lock(&mutex);
pthread_mutex_unlock(&mutex);
```

그렇다면 이렇게 lock/unlock하는 건 어떤 의미를 갖고 있을까요? lock이란 그 mutex로 시작되는 임계구역에 진입할 것이고, 다른 스레드의 진입을 차단하겠다는 의미입니다. 

increaseAndPrint()가 아래와 같이 구성되어있을 때 한 스레드가 함수에 진입하게되면 우선 mutex를 lock하겠죠. 그렇게 되고나면 다른 스레드가 increaseAndPrint()안에 들어와도 pthread_mutex_lock()부분에서 블로킹에 걸리게 됩니다. 그 mutex가 unlock상태가 될 때까지 기다리게 되는 것이죠.

그래서 이런 과정을 통해 임계 구역에 한 스레드만 들어올 수 있는 상호 배제가 실현되는것입니다.

```c
void increaseAndPrint()
{
  pthread_mutex_lock(&mutex);

  x++;
  printf("%d\n", x);

  pthread_mutex_unlock(&mutex);
}
```

### 2. 문제 설명
&nbsp;이제 문제를 푸는데 필요한 개념은 다 준비된 것 같습니다. 그러면 문제를 간단히 소개해 드리겠습니다. 기본적인 상황은 다음과 같습니다. 철학자 n명이 원탁을 둘러싸고 있고, 철학자 사이에는 포크가 하나씩 있습니다. 원탁 가운데에는 스파게티가 있으며 철학자가 스파게티를 먹기 위해서는 포크 2개가 필요합니다. 철학자는 먹기, 자기, 생각하기 를 돌아가며 합니다. 그리고 각 행동을 하는데 time_eat, time_sleep, time_think만큼의 시간이 듭니다. 

&nbsp;여기서 문제는 철학자가 밥을 먹고 나서 살 수 있는 시간 time_alive가 정해져있다는 것입니다. 그래서 이 시간이 지나기 전에 먹기, 자기, 생각하기를 모두 끝내야합니다. 그런데 만약 밥을 먹어야하는데 포크가 없다면 밥을 못 먹겠죠. 그래서 포크라는 공유 자원을 잘 분배해서 모든 철학자들이 잘 먹고 잘수있도록 하는 것이 이 문제의 핵심입니다.

문제의 상황을 앞서 설명한 개념을 토대로 표현해보자면 각 철학자는 하나의 스레드이며 식사를 하는데 필요한 포크는 뮤텍스입니다. 각 철학자는 포크라는 뮤텍스를 lock을 통해 잡아야 식사를 할 수 있는 것입니다.

### 3. 코드 진행

### 3.1 철학자 생성
&nbsp; 우선 철학자 역할을 하는 스레드를 생성합니다. 각 철학자는 info라는 공통 구조체를 가지고, routine이라는 함수를 실행합니다. 이렇게 하기 위해 다음과 같이 철학자 변수를 할당하였습니다.

>  philosopher = birth(info, idx);

이제 스레드를 생성할 것인데 pthread_create()를 이용할 것 입니다.pthread_create()는 스레드가 처음에 실행할 함수와 그 함수에 넘길 변수를 인자로 받아 스레드를 생성합니다.

> pthread_create(&(philosopher->id), 0, routine, (void *)philosopher)

```c
typedef struct s_info
{
	pthread_mutex_t	*fork;
	pthread_mutex_t	*meal_mutex;
	pthread_mutex_t	*end_mutex;
	pthread_mutex_t	print_mutex;
	pthread_mutex_t	ready_mutex;
	pthread_mutex_t	err_mutex;
	long long		start_time;
	long long		*meal_taken;
	long long		*t_last_meal;
	int				*is_end;
	int				err;
	int				t_die;
	int				t_eat;
	int				t_sleep;
	int				min_dine;
	int				head_cnt;
}	t_info;

typedef struct s_phil
{
	pthread_t		id;
	t_info			*info;
	int				num;
}	t_phil;

t_phil	**make_philosophers(t_info *info)
{
	int		idx;
	t_phil	**philo_list;
	t_phil	*philosopher;

	idx = 0;
	philo_list = malloc(sizeof(t_phil *) * info->head_cnt);
	if (!philo_list)
		return (NULL);
	while (idx < info->head_cnt)
	{
		philosopher = birth(info, idx); // 철학자 변수 할당
		if (!philosopher)
		{
			terminate_program(philo_list, info, idx);
			return (NULL);
		}
		if (pthread_create(&(philosopher->id), 0, routine, (void *)philosopher)) // 철학자 스레드 생성
		{
			terminate_program(philo_list, info, idx + 1);
			return (NULL);
		}
		philo_list[idx++] = philosopher; // 철학자 관리
		usleep(5);
	}
	return (philo_list);
}
```

### 3.2 Routine 함수
스레드가 생성되면 그 스레드는 routine()을 실행하게 됩니다. routine() 함수는 모든 철학자 스레드가 생성될 때까지 기다렸다가 먹고 자고 생각하기를 반복하도록 되어있습니다.

```c
void	*routine(void *philosopher)
{
	t_phil	*philo;

	philo = (t_phil *)philosopher;
	if (philo->num + 1 == philo->info->head_cnt) // 마지막 철학자가 시작시간 세팅
		set_start_time(philo);
	while (1)
	{
		if (is_err(philo))
			return (0);
		pthread_mutex_lock(&(philo->info->ready_mutex)); // 시작시간 변수 확인을 위해 뮤텍스 사용
		if (philo->info->start_time)
		{
			pthread_mutex_unlock(&(philo->info->ready_mutex));
			break ;
		}
		pthread_mutex_unlock(&(philo->info->ready_mutex));
	}
	if (philo->num % 2 == 0) // 홀수번째 철학자 먼저 시작하게하여 데드락 방지
		usleep(1000);
	while (1) // 루틴 실행
	{
		if (!philo_eat(philo) || !philo_sleep(philo) || !philo_think(philo))
			break ;
	}
	return (0);
}

```

### 4. 교착 상태(Deadlock) 문제
그런데 이렇게 코드를 철학자를 진행하다보면 문제가 생길 때가 있습니다. 철학자는 식사를 하기 위해 자기 양 옆에 있는 포크라는 뮤텍스를 lock하려고 시도합니다. 그런데 만약에 이런 상황이 발생하면 어떡할까요? 2명의 철학자가 있는데 첫번째 철학자는 오른쪽 포크 뮤텍스를 lock했고 두번째 철학자는 왼쪽 포크 뮤텍스를 lock한 것입니다. 근데 두 철학자 모두 두개의 포크 뮤텍스를 lock거는 것이 목표이기때문에 서로 이미 lock된 상대방의 포크를 unlock하려고 시도할 것입니다.

그런데 아시다시피 lock된 mutex에 pthread_mutex_lock()을 시도하게되면 블로킹에 걸립니다. 그래서 결과적으로 두 철학자 스레드 모두 블로킹에 걸려 프로그램이 멈춰있게 되어버립니다. 이런 상황을 교착 상태(Deadlock)이라고 부릅니다.

### 4.1 데드락 해결
철학자 문제에서 이런 데드락 상황은 잘 발생합니다. 그래서 이 상황을 방지하기 위해서 제가 쓴 방법은 데드락이 발생하지 않도록 홀수번째 철학자는 오른쪽 포크를, 짝수번째 철학자는 왼쪽 포크를 잡도록 하였습니다. 또한 홀수번째 철학자가 맨 처음에 먼저 식사를 하도록 하여서 혹시 모를 꼬임이 없도록 하였습니다.

# 느낀 점
멀티 스레딩이라는 것은 현대에 굉장히 중요한 기술이라는 것을 들어서 알고 있었지만 정확히 프로세스와 스레드가 어떤 것이고 어떻게 멀티 스레딩이 가능한지에 대해서 배워본적이 없었습니다. 그런데 이번에 철학자 문제를 해결하면서 스레드란 어떻게 동작하고, 어떻게 생성되는지 정확히 알 수 있었고 멀티 스레딩 시 고려할 문제들에 어떤 것들이 있는 확실히 알 수 있었습니다. 

# 추가공부
* 멀티스레드 vs 비동기, 비동기는 어떻게 구현되는가
* 내부적으로 os가 mutex를 어떻게 처리하는지