---
emoji: 🖥
title: '[BOJ] 2609 : 최대공약수와 최소공배수'
date: '2022-03-20 16:28:00'
author: 윤건우
tags: Algorithm BOJ
categories: Algorithm
---

이번주 월요일부터 [solved.ac](http://solved.ac) 의 Class 2 문제를 풀기 시작했는데, 백준 2609번 문제 최대공약수와 최소공배수를 푼 뒤 문제를 푼 방법을 기록해 놓으면 좋을 것 같아 작성해 본다. 추후에 소수 구하기 알고리즘 또한 작성하려 한다.

## 1. 최대공약수

최대공약수를 구할 때에는 `유클리드 호제법`을 이용했다. 기존에는 A와 B의 최대공약수가 A와 B의 차와 A의 최대공약수와 같다고 알고 있었는데, 나눈 나머지와의 최대공약수였다. 물론, A와 B의 차이로 계산하더라도 결국에는 계속 빼다보면 나머지가 남게 되므로, 원리적으로는 같다. 다만 뺄셈으로 계산할 경우 몫이 큰 경우 재귀함수가 그만큼 여러 번 호출될테다보니 오래 걸릴 수 있겠다.

## 1.1. 유클리드 호제법 소개

> 1 ≤ A ≤ B, A와 B가 자연수일 때,
>
> A와 B의 최대공약수는 A와 (B를 A로 나눈 나머지)의 최대공약수와 같다.
>
> B를 A로 나눈 나머지가 0이라면, 최대공약수는 A이다.


## 1.2. 증명

A와 B의 최대공약수를 G라고 하자. 그러면 A = aG, B = bG로 나타낼 수 있다. 이 때, a와 b는 서로소이다. B를 A로 나누면 B = Ad + r 이고, A = aG, B= bG 로 치환하면 bG = aGd + r 이다. 나머지 r = (b - ad)G 로 표현 가능하다. 따라서 G는 A와 r의 공약수이다. 만약 A와 r 사이에 G보다 큰 G’ 이라는 최대공약수가 있다고 치자. 두 수의 모든 공약수는 최대공약수의 약수이므로, G’ = xG로 표현할 수 있다.

A = aG = mG’ = mxG, r  = (b - ad)G = nG’ = nxG

a = m**x**, b - ad = nx, b = nx + ad = nx + mxd = (n + md)**x**

x는 a와 b의 공약수, a와 b는 서로소이므로 x = 1 이다. 따라서 G = G’ 이므로 A와 B의 최대공약수와 A와 r의 최대공약수는 같다.

## 1.3.  C++ 코드

처음에 두 수의 차를 이용해 구한 C++ 재귀함수 코드는 다음과 같다.

```cpp
int GCD(int a, int b) {
	if (a == b)
		return a;
	else
		return a < b ? GCD(b - a, a) : GCD(b, a);
}
```

다음은 유클리드 호제법을 이용해 C++ 재귀함수로 구현한 코드이다.

1. a == 0 일 때
    - GCD(a, b) = b
2. a ≤ b 일 때
    - GCD(a, b) = GCD (b % a, b)
3. a > b 일 때
    - GCD(a, b) = GCD (b, a)

```cpp
int GCD(int a, int b) {
  if (a == 0)
    return b;
  return a <= b ? GCD(b % a, a) : GCD(b, a);
}
```

## 2. 최소 공배수 (Least Common Multiple)

최소공배수는 간단하게 최대공약수를 이용하면 된다.

## 2.1. 원리

1 ≤ A ≤ B, A와 B는 자연수일 때, A와 B의 최대공약수를 G라고 하자. 그러면 A = aG, B = bG로 나타낼 수 있다. 이 때, a와 b는 서로소이다. 따라서 A와 B의 최소공배수는 abG이다.

## 2.2. C++ 코드

```cpp
int LCM(int a, int b) {
	return a * b / GCD(a, b);
}
```

```toc
```
