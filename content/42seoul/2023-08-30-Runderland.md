---
title: RunderLand, AR Running Application
date: 2023-11-20 14:00:00 +0900
categories: [Project]
tags: [AR, Project]
pin: true
math: true
mermaid: true
image:
  path: /assets/img/blog/runderlandPlay.png
  lqip: data:image/webp;base64,UklGRpoAAABXRUJQVlA4WAoAAAAQAAAADwAABwAAQUxQSDIAAAARL0AmbZurmr57yyIiqE8oiG0bejIYEQTgqiDA9vqnsUSI6H+oAERp2HZ65qP/VIAWAFZQOCBCAAAA8AEAnQEqEAAIAAVAfCWkAALp8sF8rgRgAP7o9FDvMCkMde9PK7euH5M1m6VWoDXf2FkP3BqV0ZYbO6NA/VFIAAAA
  alt: Runderland playing image
---

## 프로젝트 소개
안녕하세요 이번 프로젝트는 2023 메타버스 개발자 경진대회에서 진행한 프로젝트입니다. 저희는 대회에서 다음의 <a href="https://www.metaversedev.kr/board_notice/show/b9dffa9a-6264-40d6-9db3-9ff35b8820ea?page=2">과제</a>에 지원하였습니다. 퀄컴 사의 Thinkreality a3라는 AR glass에서 작동하는 ar앱을 만드는 것이 목표였는데요 저희가 만든 것은 바로 Runderland라는 AR 러닝 앱입니다.

## 프로젝트 구현 영상
1차(~08.20)
{% include embed/youtube.html id='WNS9c8TE59s' %}

2차(~09.20)
{% include embed/youtube.html id='O8mDsIyQ21E' %}

## 프로젝트 기능 소개
Runderland는 말씀드렸다시피 가상의 러닝 메이트를 보여주는 AR 앱입니다. 그래서 저희는 다음과 같은 기능들을 구현하였습니다.

#### 아바타 선택
- 자전거, 달리기 중 선택
- 아바타 종류에 따라 다른 운동 가능

#### 기록 보기
- 과거 운동 기록(경로, 거리, 시간) 조회 가능
- 자신의 기록을 아바타가 뛰게해 기록과 경쟁 가능

#### 네비게이션
- T map API 연동
- 플레이 시 목적지로 가는 경로 지도에 표기

#### 플레이 모드 선택
- 싱글 플레이
	- 설정된 속도로 아바타가 운동
- 기록과 플레이
	- 아바타가 자신의 과거 기록으로 움직임
	- 자신의 과거와 경쟁 가능
- 멀티 플레이
	- 타 지역에 있는 플레이어를 아바타에 동기화시켜 같이 운동 가능
	- 기기 수 부족으로 접속이 되는지 테스트만 진행

#### 게임 플레이
1. 목적지 설정
2. 옵션 설정(아바타 속도, 이펙트, 정보창 on/off 등)
3. 게임 시작
4. 실시간으로 아바타와 같이 운동
    - 6dof를 이용하여 사용자의 속도, 위치 계산
    - GPS정보를 실시간으로 받아서 운동 기록 저장 + 오차 보정
    - 사용자의 이동 벡터를 이용하여 사용자의 이동 방향을 계산, 그를 통해 아바타의 위치 설정

# 구현 핵심 소개
이번에는 저희가 구현을 하려고 헀던 핵심 기능들 중 구현하기 어려웠던 기능들이 있는데 그 것들을 어떻게 해결했는지 소개해드리려고 합니다.

1. 사용자의 이동 방향벡터 얻기
2. 네비게이션 기능

### 1. 사용자의 이동 방향 벡터 얻어내기
Runderland에서 아바타는 사용자의 앞쪽이나 뒤쪽에 거리차이만큼 떨어져서 렌더링되어야합니다. 그러기 위해서 렌더링할 방향과 거리를 알아야 합니다. 거리는 쉽게 알 수 있으니 방향을 아는 것이 중요하겠죠.

방향을 설정하는데에는 두 가지 방법이 있습니다.

첫번째는 내 ar기기가 향하는 방향을 아바타가 렌더링될 방향으로 설정하는 것입니다. 이렇게 하면 사용자가 어느 방향으로 이동하고 있는지 같은 건 알 필요가 없습니다.     그런데 이 방법을 사용할 시 문제는 사용자가 그냥 머리를 돌리기만 해도 아바타가 같이 돌아가버려서 현실같은 러닝메이트의 느낌은 나지 않습니다. 

그래서 저희는 두번째 방법, 사용자의 이동 방향 벡터를 계산해서 그 방향을 기준으로 아바타를 렌더링하기로 결정하였습니다.

기본적으로 이동 방향 벡터를 계산하는 방법은 간단한데요. AR glass의 6dof가 포지셔널 트래킹을 지원하므로 내가 이동함에 따라 유니티 상의 좌표는 그대로 변하게 됩니다. 그리고 그 좌표는 `arCamera.transfrom.position`으로 받아올 수 있죠. 그러면 일정 시간마다 이 좌표를 받아와서 직전의 좌표를 빼면 이동 방향 벡터가 나오게 됩니다.

그래서 다음과 같이 directionVector를 0.04초마다 연산하게 됩니다.

```c#
IEnumerator UpdateMovement()
{        
    prevPositionMov = arCamera.transform.position; // 과거 좌표

    while (true)
    {            
        currPositionMov = arCamera.transform.position; // 현재 좌표

        dxMov = currPositionMov.x - prevPositionMov.x;
        dyMov = currPositionMov.y - prevPositionMov.y;
        dzMov = currPositionMov.z - prevPositionMov.z;

        double movement = Math.Sqrt(Math.Pow(dxMov, 2) + Math.Pow(dyMov, 2) + Math.Pow(dzMov, 2)); // 움직인 거리

        if (movement > 0.025) // 움직인 거리가 일정량 이상일 때
        {
            directionVetor = Vector3.Normalize(new Vector3(dxMov, dyMov, dzMov)); // 방향 벡터 구하기
        }      
        prevPositionMov = currPositionMov;
        yield return new WaitForSecondsRealtime(0.04f); // 0.04초 대기
    }        
}
```

그런데 이렇게 해도 아직 문제가 있습니다. 방향 벡터를 구할 수 있는 것은 맞는데 실제로 이걸 기반으로 계산된 방향 벡터를 시각화시킨 뒤 걸어보면 일직선으로 걷더라도 굉장히 벡터가 흔들립니다. 이는 사람이 걸을 때 몸이 생각보다 많이 흔들리고, 이미 사람의 미세한 진동이나 기기 측정 오차로 인해 벡터 방향이 흔들릴 수 있기때문으로 생각되었습니다. 

그래서 저희는 이것을 보정해야겠다고 생각했고, 일직선으로 가더라도 방향 벡터가 좌우로 흔들리니 최근 10개정도의 방향 벡터를 이용하여 최신 방향 벡터를 계산하면 흔들림의 영향이 줄어들지 않을까 생각했습니다.

<img src="/assets/img/blog/lerp.png" alt="lerp image">

저희가 구현한 방법은 다음과 같습니다. `Vector3.Lerp()`를 이용하여 직전의 방향 벡터(lastVector)와 가장 최근의 방향벡터(queue.Peek()) 사이의 벡터를 구합니다. 이렇게 구현하면 기존의 방향 벡터가 흔들리지않게 중심을 잡아주는 한편 새로운 방향 벡터의 효과는 누적되어 흔들림 없이 올바른 방향 벡터를 구할 수 있을 것입니다.

코드를 보면 UpdateMovement()는 일정량 이상 움직였을 때 directionVectorList(큐인데 지금보니 이름이 리스트네요...)라는 LimitedSizeQueue에 새 방향 벡터를 넣습니다. LimitedSizeQueue는 특별한 것은 아니고 Queue를 기반으로 10개만 담아놓을 수 있도록 새로운 클래스를 만들어둔 것입니다. 그런 뒤 `directionVectorList.GetFilteredDirectionVector()`를 이용하여 Lerp가 적용된 방향 벡터를 계산해옵니다.

```c#
public Vector3 GetFilteredDirectionVector()
{
    Vector3 filteredDirectionVector;
    if (queue.Count == 0)
    {
        return (Vector3.zero);
    }

    filteredDirectionVector = Vector3.Lerp(lastVector, queue.Peek(), lerfArgument);

    lastVector = filteredDirectionVector;
    
    return (filteredDirectionVector);
}

IEnumerator UpdateMovement()
{        
    prevPositionMov = arCamera.transform.position;

    while (true)
    {            
        currPositionMov = arCamera.transform.position;

        dxMov = currPositionMov.x - prevPositionMov.x;
        dyMov = currPositionMov.y - prevPositionMov.y;
        dzMov = currPositionMov.z - prevPositionMov.z;

        double movement = Math.Sqrt(Math.Pow(dxMov, 2) + Math.Pow(dyMov, 2) + Math.Pow(dzMov, 2));
        if (movement > 0.025)
        {
            directionVectorList.Enqueue(new Vector3(dxMov, 0, dzMov)); // 새 방향 벡터 삽입
        }           
        prevPositionMov = currPositionMov;
        directionVector = Vector3.Normalize(directionVectorList.GetFilteredDirectionVector()); // 방향 벡터 계산
        yield return new WaitForSecondsRealtime(0.04f);
    }        
}
```

자 이제 어느정도 안정화된 방향 벡터를 얻었습니다. 좌우로 흔들리지도않고 내가 가는 방향을 잘 따라옵니다. 그런데 아직 모든 문제가 해결된 것은 아닙니다.

이 방식을 사용하면 사용자가 곡선으로 이동하면 저희는 그대로 따라가는 방향 벡터가 얻을 수 있을까요? 실제로 테스트해본 결과 잘 따라오지 못했습니다. 곡선으로 이동하면 따라오는데 시간이 좀 걸립니다.

이를 보완하기 위해서 저희는 한 가지 방법을 추가했습니다. 사람이 곡선으로 이동할 때 머리가 같이 돌아가는 것에 착안해 AR glass가 특정 각도 이상 돌아가고 있으면 사용자가 곡선으로 이동한다고 판단해 `Lerp(vector, vector, argument)`의 argument값을 크게 조정해주었습니다. 그렇게 되면 최신 방향 벡터에 좀 더 큰 가중치를 주어 빠르게 곡선이동에 반응하게 될 것입니다.

그 결과 최종적인 함수는 다음과 같이 되었습니다.

```c#
IEnumerator UpdateMovement()
{        
    prevPositionMov = arCamera.transform.position;

    /// 추가된 부분: 각도 얻기
    float rot = arCamera.transform.rotation.eulerAngles.y;
    float prevRot = rot;
    ///
    while (true)
    {            
        rot = arCamera.transform.rotation.eulerAngles.y;
        currPositionMov = arCamera.transform.position;

        dxMov = currPositionMov.x - prevPositionMov.x;
        dyMov = currPositionMov.y - prevPositionMov.y;
        dzMov = currPositionMov.z - prevPositionMov.z;

        double movement = Math.Sqrt(Math.Pow(dxMov, 2) + Math.Pow(dyMov, 2) + Math.Pow(dzMov, 2));
        /// 추가된 부분: 머리가 일정 각도 이상 돌아가면 새 방향 벡터에 가중치를 크게 줌
        if (Math.Abs(rot - prevRot) > 1.3)
            directionVectorList.setArgument(0.6f);
        else
            directionVectorList.setArgument(0.1f);
        ///
        if (movement > 0.025)
        {
            directionVectorList.Enqueue(new Vector3(dxMov, 0, dzMov));
        }

        prevRot = rot;
        prevPositionMov = currPositionMov;
        directionVector = Vector3.Normalize(directionVectorList.GetFilteredDirectionVector());
        yield return new WaitForSecondsRealtime(0.04f);
    }        
}
```

### 2. 네비게이션

Runderland를 플레이할 때 저희는 단순히 아바타와 운동하는 것 뿐만 아니라 특정 목적지까지 안내하는 기능도 제공하고 싶었습니다. 그래서 넣은 것이 지도와 네비게이션 기능입니다.

네비게이션 기능을 구현하기 위해서 저희는 출발지와 목적지의 좌표로 길찾기 api를 호출해 경로 상의 좌표를 받아오고, 그 좌표를 지도에 표시해주려고 하였습니다. 그런데 문제는 카카오맵이나 네이버맵 api는 차도를 이용한 길찾기 기능만 제공하고 있었습니다.

다른 방법을 찾다보니 T map이 도보 길찾기 api를 제공해주고 있기에 T map을 사용하기로 하였습니다. 출발지와 도착지의 좌표만 알고 있다면 유니티에서 api를 호출하는 것은 어렵지 않았는데요. 아래와 같이 url을 세팅해준뒤 url과 apiKey를 이용해서 request를 보내면 됩니다.

```c#
string url =  $"{baseUrl}?version=1&format=json" +
              $"&startX={startX}&startY={startY}&endX={endX}&endY={endY}" +
              $"&reqCoordType={reqCoordType}&resCoordType={resCoordType}" +
              $"&startName={startName}&endName={endName}";

// Create a UnityWebRequest
UnityWebRequest request = UnityWebRequest.Get(url);
request.SetRequestHeader("appKey", apiKey);

// Send the request
yield return request.SendWebRequest();

// Check for errors
if (request.result != UnityWebRequest.Result.Success)
{
  navigationText.text = "인터넷 연결 문제";
  Debug.LogError($"Error: {request.error}");
  yield break;
}

// Parse the JSON response
string jsonResponse = request.downloadHandler.text;
```

그런데 문제는 이렇게 받아온 좌표들을 지도 상에 찍어보니 너무 듬성듬성 찍혀있던 것이었습니다. T map은 경로 상의 모든 좌표를 리턴해주는 것이 아니라 코너를 돌아야하거나 직선 상으로 100m를 이동해야하는 등 어떤 행동을 해야하는 특정 위치를 중점적으로 좌표를 알려주었습니다. 그렇다보니 목적지까지 가는 길을 지도 상에 표시해도 너무 없어보였죠.

그래서 이 상황을 해결하기 위해 저희는 아래와 같이 또 보정을 해주었습니다. 한 점과 다른 점 사이의 거리가 5이상 넘어간다고 생각되면 `거리 / 5`만큼의 점을 추가로 찍어주었습니다. 

```c#
GPSData prev = new(coordinates[i].Item2, coordinates[i].Item1, 0);
GPSData next = new(coordinates[i + 1].Item2, coordinates[i + 1].Item1, 0);

double distance = GPSUtils.CalculateDistance(prev, next);
if (distance > 5)
{
    int pointCnt = (int) (distance / 5);
    for (int j = 1; j <= pointCnt; j++)
    {
        coordinates.Insert(i + j - 1, new Tuple<double, double>((double)Mathf.Lerp((float)prev.longitude, (float)next.longitude, (float)(5 * j / distance)), (double)Mathf.Lerp((float)prev.latitude, (float)next.latitude, (float)(5 * j / distance))));
    }
    i += pointCnt;
}
```
그래서 최종적으로 네비게이션 기능을 완성할 수 있었습니다.
<img src="/assets/img/blog/navigation.png" alt="navigation image">

# 이슈
Runderland를 개발하면서 어려웠던 부분들을 위와같이 소개해드렸는데요. 아래는 개발과 관련된 내용은 아니지만 이번 프로젝트를 진행하며 이런 것도 신경써야하는 구나 느꼈던 것들에 대해 소개하려고 합니다.

1. GPS 튐
2. 의존성 이슈

### 1. GPS 튐
저희 앱의 핵심 기능 중 하나는 사용자의 운동 중 이동 기록을 저장하는 것입니다. 그를 통해 사용자는 자신이 어떤 경로로 얼마나, 어떤 페이스로 이동했는지 조회할 수 있습니다. 또한 그 기록을 아바타에 씌워서 자신과 경쟁하는 것처럼 할 수도 있죠.

그래서 저희는 계속해서 GPS 정보를 받아와서 저장하려고하였습니다. 그런데 문제는 대부분의 경우 잘 GPS가 잘 측정되지만 터널 밑에 있거나 건물들 사이에 있을때 가끔씩 튀는 경우가 있었습니다. 이럴 경우 사용자의 이동 거리와 이동 방향이 튀어버려서 앱 기능에 문제가 생겨 저희는 초당 측정하는 두 GPS 사이의 거리가 10m이상 벌어지면 직전의 이동방향과 이동거리를 이용하여 보정해주는 방식을 사용했습니다.

<div style="display:flex;">
    <img src="/assets/img/blog/gps_fluctuate.png" alt="gps fluctuate"/>
    <img src="/assets/img/blog/gps_stable.png" alt="gps stable" />
</div>  

### 2. 의존성 이슈
유니티로 thinkreality a3에 적용될 앱을 개발하기 위해서 저희는 퀄컴 사에서 제공하는 sdk와 여러 유니티 패키지를 설치했습니다. 그런데 문제는 저희가 지도를 구현하는데 사용하려고 했던 mapbox라는 서비스가 퀄컴의 환경과 같이 동작하지 못한다는 것을 알게되었습니다.

외부 유니티 프로젝트에서 지도를 구현해보고 그 모듈을 그대로 메인 프로젝트에 넣었는데 api가 제대로 동작하지 않는 것이었습니다. 저희는 개발을 하면서 처음으로 이런 의존성 이슈를 실제로 겪어보게되었고 찾아본 결과 다른 사람들도 해결을 못해 다른 api를 썼다는 것을 알게 되었고 마이크로소프트의 bing map을 이용하여 지도를 구현하게되었습니다.


## 대회에서 느낀 점
이번에 AR앱을 개발하고 심사를 받으면서 여러 피드백을 받았습니다. 기억이 나는 피드백은 상업성 관련 피드백이었습니다. 저희는 만들고 싶은 AR앱을 만들었지만 이것이 실제로 지금 상용화가능하고 상업성이 있느냐?라는 질문을 받았을 때는 할말이 없었습니다. 

왜냐하면 빛이 없는 공간에서는 센서들이 잘 작동하지않았고 운동을 할 때에 AR glass를 쓰고 있으면 분명히 위험할 수도 있기때문입니다. 그래서 이번 대회를 거치며 아 소프트웨어 개발을 할 때 상업성도 꼭 고려해야하는 측면인데 너무 잊고있었다는 생각도 하게 되었습니다.

또 AR을 하게될지는 모르겠지만 어떤 것을 만들더라도 다음에는 그 제품의 재미, 의미뿐 아니라 현실성도 같이 고려해봐야겠습니다. 하지만 그렇다 하더라도 굉장히 재밌고 흥미로운 프로젝트였으니 아직 고민 중인 분이 계신다면 AR관련 앱을 꼭 만들어보시는 것을 추천드립니다.