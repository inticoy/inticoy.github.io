---
title: Sleep AI Challenge
date: 2022-12-07 20:55:00 +0800
categories: [Computer Science, AI]
tags: [Computer Science, AI]
image: ./assets/img/2022-12-07-MAIC/sleep_background1.png
math: true
---

서울대학교병원에서 진행하는 [Sleep AI Challenge ver.3](https://maic.or.kr/competitions/20/infomation) 에 참여했다.

## 0. 사전 지식

폐쇄성 수면 무호흡증(OSA, Obstructive Sleep Apnea)은 수면다원검사(PSG, polysomnography)를 통해 진단할 수 있다. OSA는 1시간에 무호흡 또는 저호흡이 발생된 횟수인 AHI(Apnea-Hypopnea Index)로 진단하는데, 수면다원검사의 데이터를 통해 OSA를 진단하는 것은 장소의 제약이 있을 뿐만 아니라, 많은 시간과 비용이 필요하다.

따라서 웨어러블 기기에서 측정할 수 있는 심전도(ECG), 움직임, 소리 데이터를 기반으로 수면무호흡증을 진단할 수 있다면 많은 비용을 아낄 수 있다.

이 대회에서는 웨어러블 기기에서 측정한 데이터를 바탕으로 폐쇄성 수면무호흡증, 즉 OSA(Obstructive Sleep Apnea)를 진단하는 것이 목표였다.


## 1. 데이터

대회에서 주어진 데이터는 EDF(European Data Format)으로 저장된 6-8 시간 가량의 시계열 생체 신호(ECG, Actigraphy, Sound)와 수면무호흡증 리스크 유무였다. 300명 내외의 Normal/OSA 데이터가 주어졌다.

### 1.1. Electrocardiogram, 심전도

![ECG](./assets/img/2022-12-07-MAIC/pqrs.png){: width="300" height="300"}*QRS 파형*

심전도는 전극을 통해 심장의 전기적 활동을 기록한 것으로, 심장 근육세포들을 통제하는 전류를 분석해서 심장의 상태를 분석할 수 있다.
심전도는 P, QRS, TU 파형을 주기적으로 반복하는데, 보통 R Peak와 다음 주기의 R Peak 간의 차이 (R-R Interval)를 구하여 심장박동의 주기를 구해 분당 심박수를 알아낼 수 있다.
> 주어진 데이터는 웨어러블 기기로 측정되었고, 보정이 되어있지 않기 때문에 파형이 매우 불규칙했다. 불규칙한 파형 속에서 R Peak를 찾아내야 했다.
{: .prompt-warning }

따라서 R-R Interval(RRi)을 구하는 Pan Tompkins 등의 알고리즘이 제대로 작동하지 않았고, 그냥 [mne 라이브러리](https://mne.tools/stable/index.html)를 쓰되, 오류가 있는 부분은 보정해주는 방식으로 데이터를 사용하였다.[^Almutairi][^Chazal]

### 1.2 Sleep Actigraphy

손목에 착용한 웨어러블 기기를 이용하여 측정한 수면 중 움직임 정보가 주어졌다. X, Y, Z축 각각의 가속도값이 따로 주어지기 때문에, 이를 한 feature으로 축소할 수 있다.

### 1.3 Mel Spectrogram

Mel이란 Stevens 등이 제시한 개념[^mel]으로, 평균적으로 사람들이 구분할 수 있는 소리의 주파수 대역별로 구분한 것이다. 주파수가 높아질 수록 한 대역의 넓이가 넓어진다. 사람이 높은 주파수에서의 주파수 변화에 보다 둔감하고, 낮은 주파수에서의 주파수 변화에 보다 민감하다는 것을 수치적으로 정량화한 것이다.

f Hz 를 m mels로 변환하는 공식은 다음과 같다:

$$ m = 2595 log_{10}\left( 1 + \frac{f}{700} \right) $$

![mel-spectrogram](./assets/img/2022-12-07-MAIC/mel-spectrogram.png){:width="500" height="300"}*Mel Spectrogram*

Mel Spectrogram은 이를 Spectrogram으로 나타낸 것이다. 소리 데이터를 short-time Fourier Transform을 거쳐 얻은 값들을 각 주파수별로 나열해서 얻어낸다. 가로는 시간, 세로는 주파수가 되고, 각 칸에 있는 수가 dB단위의 소리 크기이다.

여러 논문들을 참고하여 Mel Spectrogram을 기계학습에 적용하는 방법에 대해서 알아보았고, 한 논문[^Oh]을 참고하여 MFCC, power mel등을 사용하지 않고 Mel Spectrogram 값을 그대로 학습에 적용하기로 하였다.

## 2. 아이디어

대회에 3명의 친구들과 함께 참가하게 되었는데, 대회 초반에는 각각 데이터 형식에 대해 알아보고, 전처리하는 법을 공부해보았다. 이 때 나왔던 방법들은 다음이 있었다.

### 2.1. 시계열 데이터를 2D 이미지로 변환해 2D CNN

RP (Recurrence Plot) 알고리즘을 이용하면 시계열 데이터를 2차원 이미지로 나타낼 수 있다. ECG 시계열 데이터를 RP를 이용하여 2차원 이미지로 만든 뒤에, CNN을 활용한 Classifier 모델을 만들어 보았다.

많은 데이터 중에서 ECG 데이터만을 활용하였고, 이 ECG 데이터 마저도 가공되지 않아 유의미한 결과를 얻기 어려웠다.

### 2.2. 시계열 데이터를 RNN, LSTM 모델에 넣어서 분석하기.

받은 데이터가 순차적인 데이터라서, RNN과 LSTM에도 적용해보았다. 그러나 각각의 데이터 길이가 약 2시간부터 8시간 정도로 천차만별이어서 근거있는 전처리와 모델링을 하기가 어려웠다. 또한 주로 Regression에 사용하는 모델이다보니 Classification에 강점이 크게 없었고, OSA 진단 기준도 데이터 순서와는 관련이 없기 때문에 제출용으로 이 모델을 사용하지 않았다.

### 2.3. 소리의 통계치를 이용하여 1차원 CNN 모델에 넣기

EDA를 통해 데이터를 분석한 것과 관련 논문들을 바탕으로, 무호흡이 발생한다는 것과 코골이, 즉 큰 소리의 발생한다는 것이 연관성이 있다고 판단하였다. 따라서 큰 소리가 감지된 사건에 대해 통계치를 이용하기로 했다. 코골이 말고 몸의 뒤척임에 의해서도 큰 소리가 발생할 수 있으므로, 가속도계를 활용하여 뒤척임에 의한 소리는 고려하지 않기로 했다[^Brennan].

- 수면 중 소리가 큰 폭으로 변화했을 경우 이것을 수면 무호흡으로 인한 코골이라고 판단하기로 했다.
- 2초씩 평균을 내서 데이터를 구한 뒤, 변동성이 큰 데이터의 비율을 구한다.

**데이터 변동이 크다**

$$
|Data_{i} - Data_{i+1}| \geq 2\sigma
$$

**데이터 변동성 비율**

$$
\frac {n \left(\{i|\ |Data_{i} - Data_{i+1}| \geq 2\sigma \}\right)} {len(Data) - 1}
$$

## 3. 데이터 전처리

1. 가속도계로 움직임이 관찰된 부분 찾기
: 3축으로 주어진 가속도 측정값을 1차원으로 만든 뒤, 이 가속도 값이 크게 움직인 부분을 찾는다. 이 부분을 자다가 몸을 뒤척인 부분으로 생각한다.
2. 움직인 부분의 전후 20초 소리 버리기
: 몸을 뒤척인 경우 코골이로 인한 것이 아닌, 몸을 뒤척임으로서 난 소리가 녹음되었을 확률이 높으므로 이 구간은 수면중이 아닌 것으로 판단하여 데이터를 버린다.
3. 남은 소리를 주파수 채널별로 통계 내기
: Mel Spectrogram의 형식으로 주어졌기 때문에 20개 채널의 소리 값이 있었는데, 각각의 채널에 대해서 데이터 변동성이 큰 구간의 비율을 구한다.
4. RRi 구하기[^Almutairi][^Chazal]
: ECG 데이터에 대해서는 mne 라이브러리를 통해 심장박동수를 구하고, 중앙값의 1.8배를 넘어가는 경우는 잘못된 데이터로 판단하고 보정해준다.
5. RRi 값을 활용하여 소리 통계 값에 가중치를 주어 RRi값 활용하기
: ECG 데이터가 크게 변하는 것도 무호흡이 발생했다는 것으로 판단할 수 있기 때문에, ECG 데이터가 크게 변한다면 소리 데이터도 크게 변한 것으로 가중치를 부여한다.

## 4. 모델

- Input (20×1) 은 주파수 별로 분리된 소리 각 채널에 대해, 소리의 변동성을 한 값으로 나타낸 값이다.
- Output (2×1)은 환자의 수면무호흡증 리스크 유무이다.
- keras framework를 이용해서 모델을 구현했고, optimizer는 Adam, loss function으로는 binary cross entropy를 사용하였다.

![model](./assets/img/2022-12-07-MAIC/model.png)*학습에 사용된 model*

[데이터 전처리](#3-데이터-전처리)에서 설명한 전처리 방식을 통해 입력값을 20×1 사이즈의 주파수 별 소리 변동성 벡터로 나타낸다. 이 소리는 주파수 별로 정렬되어 있으므로, 각 주파수 간의 관계를 나타내기 위해 1D Convolution Layer를 이용하였다. 이후 FC Layer를 거쳐 Normal/OSA로 분류하게 된다.

## 5. 결과

우리 팀은 Public Score에서 최종적으로 5등으로 마무리했다. 5등까지의 팀들은 12월 1일 목요일에 서울대학교병원 융합의학 기술원에서 각자 발표를 진행해 모델에 대해 설명했다.

발표를 준비하면서 다음과 같이 개선점들을 정리해볼 수 있었다.
- 가속도 센서를 이용한 수면 감지 알고리즘의 개선
- 깔끔하지 않은 ECG 데이터에서 R peak를 감지 및 보정하는 알고리즘의 개선
- ECG Derived Respiration(EDR) 데이터 모델에 적용

Public Score에서 5등이라서 큰 기대는 하지 않고 발표를 진행했었는데, 발표와 Private Score가 좋았는지 최종적으로는 2등으로 마무리했다. 처음 나간 AI 대회에서 성과까지 거둘 수 있어서 굉장히 좋은 경험이었다.

## 6. References

[^Oh]: W. Oh, “Comparison of environmental sound classification performance of convolutional neural networks according to audio preprocessing methods,” *The Journal of the Acoustical Society of Korea*, vol. 39, no. 3, pp. 143–149, May 2020.

[^Almutairi]: H. Almutairi, G.M. Hassan, A. Datta, Classification of obstructive sleep apnoea from single-laead ecg signals using convolutional neural and long short term memory networks, Biomed. Signal Process Control 69 (2021), 102906

[^Chazal]: de Chazal P, Heneghan C, Sheridan E, Reilly R, Nolan P, O'Malley M. Automated processing of the single-lead electrocardiogram for the detection of obstructive sleep apnoea. IEEE Trans Biomed Eng. 2003 Jun;50(6):686-96. doi: 10.1109/TBME.2003.812203. PMID: 12814235.

[^Brennan]: Brennan, H. L., & Kirby, S. D. (2022). Barriers of artificial intelligence implementation in the diagnosis of obstructive sleep apnea. Journal of otolaryngology - head & neck surgery = Le Journal d'oto-rhino-laryngologie et de chirurgie cervico-faciale, 51(1), 16. https://doi.org/10.1186/s40463-022-00566-w

[^mel]: Stevens, Stanley Smith; Volkmann; John & Newman, Edwin B. (1937). ["A scale for the measurement of the psychological magnitude pitch"](https://archive.today/20130414065947/http://asadl.org/jasa/resource/1/jasman/v8/i3/p185_s1). *Journal of the Acoustical Society of America*. **8** (3): 185–190. [Bibcode](https://en.wikipedia.org/wiki/Bibcode_(identifier)):[1937ASAJ....8..185S](https://ui.adsabs.harvard.edu/abs/1937ASAJ....8..185S). [doi](https://en.wikipedia.org/wiki/Doi_(identifier)):[10.1121/1.1915893](https://doi.org/10.1121%2F1.1915893).
