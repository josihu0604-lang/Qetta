# 🔬 Catalyst UI Kit - 폼 컴포넌트 상세 분석

## 📋 목차
1. [Select (드롭다운)](#select-드롭다운)
2. [Checkbox (체크박스)](#checkbox-체크박스)
3. [Radio (라디오 버튼)](#radio-라디오-버튼)
4. [Switch (토글 스위치)](#switch-토글-스위치)
5. [Fieldset (폼 그룹)](#fieldset-폼-그룹)
6. [고급 CSS 기법](#고급-css-기법)

---

## Select (드롭다운)

### 구조 분해
```jsx
<span data-slot="control">    {/* 래퍼 */}
  <Headless.Select>           {/* 실제 select 요소 */}
  <span>                      {/* 화살표 아이콘 (싱글 선택만) */}
    <svg>...</svg>
  </span>
</span>
```

### 멀티 vs 싱글 선택

#### 싱글 선택 (기본)
```jsx
<Select name="country">
  <option>Canada</option>
  <option>United States</option>
</Select>

// 패딩
pr-[calc(--spacing(10)-1px)]  // 우측 40px (화살표 공간)
pl-[calc(--spacing(3.5)-1px)] // 좌측 14px
```

#### 멀티 선택
```jsx
<Select name="countries" multiple>
  <option>Canada</option>
  <option>United States</option>
</Select>

// 패딩 (좌우 동일)
px-[calc(--spacing(3.5)-1px)]  // 14px (화살표 없음)
```

### 화살표 아이콘 (SVG)

```jsx
// 더블 화살표 (위/아래)
<svg viewBox="0 0 16 16" className="size-5 sm:size-4">
  {/* 아래 화살표 */}
  <path d="M5.75 10.75L8 13L10.25 10.75" />
  
  {/* 위 화살표 */}
  <path d="M10.25 5.25L8 3L5.75 5.25" />
</svg>
```

**특징**:
- `pointer-events-none`: 클릭 차단 (Select 클릭만 유효)
- `absolute right-0`: 오른쪽 정렬
- `stroke-zinc-500 dark:stroke-zinc-400`: 색상 테마

### OptGroup 지원

```jsx
<Select>
  <optgroup label="North America">
    <option>Canada</option>
    <option>United States</option>
  </optgroup>
  <optgroup label="Europe">
    <option>France</option>
    <option>Germany</option>
  </optgroup>
</Select>

// 스타일
[&_optgroup]:font-semibold  // optgroup 레이블 강조
```

### 다크 모드 Option 배경

```css
dark:*:bg-zinc-800  /* 다크 모드에서 option 배경색 */
```

**이유**: macOS Safari에서 다크 모드 option이 밝게 표시되는 버그 방지

---

## Checkbox (체크박스)

### 3-Layer 구조

```
1. <Headless.Checkbox>        (그룹 컨테이너)
2. <span>                     (체크박스 박스)
3. <svg>                      (체크마크 아이콘)
```

### 레이아웃 (CheckboxField)

```css
grid grid-cols-[1.125rem_1fr]  /* 체크박스: 18px, 나머지: 유연 */
gap-x-4 gap-y-1                /* 가로 16px, 세로 4px 간격 */

/* 모바일 */
grid-cols-[1.125rem_1fr]  /* 18px */

/* 데스크톱 */
sm:grid-cols-[1rem_1fr]   /* 16px */
```

### 체크박스 크기

```
모바일:    18px x 18px  (size-4.5)
데스크톱:  16px x 16px  (size-4)
```

### 체크마크 애니메이션

```jsx
<svg className="
  opacity-0                       /* 기본: 숨김 */
  group-data-checked:opacity-100  /* 체크 시: 표시 */
">
  {/* 체크마크 (✓) */}
  <path 
    d="M3 8L6 11L11 3.5"
    className="
      opacity-100                       /* 기본: 표시 */
      group-data-indeterminate:opacity-0 /* 불확정 시: 숨김 */
    "
  />
  
  {/* 불확정 (―) */}
  <path 
    d="M3 7H11"
    className="
      opacity-0                         /* 기본: 숨김 */
      group-data-indeterminate:opacity-100 /* 불확정 시: 표시 */
    "
  />
</svg>
```

### 상태별 스타일

#### 미체크 (기본)
```css
border: 1px solid rgba(0,0,0,0.15)
background: white
shadow: sm
```

#### 체크됨
```css
border: transparent
background: var(--checkbox-checked-bg)    /* 색상에 따라 변경 */
```

#### 호버 (미체크)
```css
border: rgba(0,0,0,0.30)  /* 보더 진하게 */
```

#### 호버 (체크됨)
```css
border: transparent  /* 변화 없음 */
```

#### 비활성화
```css
opacity: 50%
border: rgba(0,0,0,0.25)
background: rgba(0,0,0,0.05)
```

### 불확정 상태 (Indeterminate)

```jsx
<Checkbox indeterminate>Select all</Checkbox>

// 사용 예: "일부 선택됨" 표시
const allChecked = items.every(i => i.checked)
const someChecked = items.some(i => i.checked)
const indeterminate = !allChecked && someChecked
```

### CSS 변수 시스템

```css
/* 색상별 변수 정의 */
[--checkbox-check:var(--color-white)]              /* 체크마크 색상 */
[--checkbox-checked-bg:var(--color-blue-600)]      /* 체크 시 배경 */
[--checkbox-checked-border:var(--color-blue-700)]  /* 체크 시 보더 */
```

---

## Radio (라디오 버튼)

### Checkbox vs Radio 차이점

| 특징 | Checkbox | Radio |
|------|----------|-------|
| **모양** | 사각형 (rounded-[0.3125rem]) | 원형 (rounded-full) |
| **인디케이터** | 체크마크 (SVG path) | 원형 점 (span + border) |
| **크기** | 18px/16px | 19px/17px |
| **선택** | 다중 선택 | 단일 선택 |

### 원형 인디케이터 구조

```jsx
<span className={base}>
  <span className="
    size-full 
    rounded-full 
    border-[4.5px]              /* 두꺼운 보더로 원형 점 생성 */
    border-transparent          /* 기본: 투명 */
    bg-(--radio-indicator)      /* 선택 시: 색상 */
    bg-clip-padding             /* 패딩 영역에만 배경 적용 */
  " />
</span>
```

**작동 원리**:
1. `border-[4.5px]`: 테두리를 매우 두껍게 설정
2. `bg-clip-padding`: 배경이 패딩 영역(안쪽)에만 적용
3. `bg-(--radio-indicator)`: 선택 시 배경색 변경
4. 결과: 중앙에 원형 점이 나타남

### 호버 효과

```css
/* 미선택 호버 */
[--radio-indicator:var(--color-zinc-900)]/10  /* 미세한 회색 */

/* 선택됨 호버 */
[--radio-indicator:var(--radio-checked-indicator)]  /* 변화 없음 */
```

### RadioGroup 사용

```jsx
<RadioGroup value={selected} onChange={setSelected}>
  <RadioField>
    <Radio value="option1" />
    <Label>Option 1</Label>
    <Description>Description for option 1</Description>
  </RadioField>
  
  <RadioField>
    <Radio value="option2" />
    <Label>Option 2</Label>
  </RadioField>
</RadioGroup>
```

---

## Switch (토글 스위치)

### 구조

```jsx
<Headless.Switch>        {/* 배경 트랙 */}
  <span>                 {/* 슬라이딩 원형 버튼 */}
</span>
```

### 크기

```
모바일:    h-6 w-10  (24px x 40px)
데스크톱:  h-5 w-8   (20px x 32px)

버튼:
모바일:    18px
데스크톱:  14px
```

### 슬라이딩 애니메이션

```css
/* 초기 위치 (OFF) */
translate-x-0

/* 체크 위치 (ON) */
group-data-checked:translate-x-4      /* 모바일: 16px 이동 */
sm:group-data-checked:translate-x-3   /* 데스크톱: 12px 이동 */

/* 트랜지션 */
transition duration-200 ease-in-out
```

### 색상 변화 트랜지션

```css
/* 기본: 즉시 변화 (0ms) */
transition duration-0

/* 상태 변화 중: 부드러운 전환 (200ms) */
data-changing:duration-200
```

**data-changing**: Headless UI가 상태 변경 중에 자동으로 추가하는 속성

### SwitchField 레이아웃

```css
grid grid-cols-[1fr_auto]  /* 레이블: 유연, 스위치: 고정 */

/* 레이블: 왼쪽 (1열, 1행) */
*:data-[slot=label]:col-start-1 
*:data-[slot=label]:row-start-1

/* 스위치: 오른쪽 (2열, 1행) */
*:data-[slot=control]:col-start-2
*:data-[slot=control]:self-start

/* 설명: 왼쪽 (1열, 2행) */
*:data-[slot=description]:col-start-2
```

**레이아웃 예시**:
```
┌─────────────────┬──────┐
│ Enable feature  │ [⚪] │  ← 1행
├─────────────────┴──────┤
│ This will enable...    │  ← 2행
└────────────────────────┘
```

### 다중 CSS 변수 (6개)

```css
/* 트랙 (배경) */
--switch-bg                /* 체크 시 트랙 배경 */
--switch-bg-ring           /* 체크 시 트랙 링 */

/* 버튼 */
--switch                   /* 버튼 배경 */
--switch-ring              /* 버튼 링 */
--switch-shadow            /* 버튼 그림자 */
```

**예시 (Blue)**:
```css
/* 체크됨 */
--switch-bg: #2563eb           (파란 트랙)
--switch-bg-ring: #1d4ed8      (진한 파란 링)
--switch: white                (흰색 버튼)
--switch-ring: #1d4ed8         (진한 파란 버튼 링)
--switch-shadow: #1e3a8a/20    (파란 그림자)
```

---

## Fieldset (폼 그룹)

### 계층 구조

```
<Fieldset>
  <Legend>Personal Information</Legend>
  <Text>Please fill out your details</Text>
  
  <FieldGroup>
    <Field>
      <Label>Name</Label>
      <Input />
      <Description>Your full legal name</Description>
    </Field>
    
    <Field>
      <Label>Email</Label>
      <Input />
      <ErrorMessage>Invalid email format</ErrorMessage>
    </Field>
  </FieldGroup>
</Fieldset>
```

### 자동 간격 시스템

```css
/* Fieldset 내부 */
*:data-[slot=text]:mt-1                /* Text 요소 상단 간격 */
[&>*+[data-slot=control]]:mt-6         /* Control 요소 전 큰 간격 */

/* Field 내부 */
[&>[data-slot=label]+[data-slot=control]]:mt-3        /* 레이블 → 컨트롤 */
[&>[data-slot=label]+[data-slot=description]]:mt-1     /* 레이블 → 설명 */
[&>[data-slot=description]+[data-slot=control]]:mt-3   /* 설명 → 컨트롤 */
[&>[data-slot=control]+[data-slot=description]]:mt-3   /* 컨트롤 → 설명 */
[&>[data-slot=control]+[data-slot=error]]:mt-3         /* 컨트롤 → 에러 */
```

**장점**: 요소 순서에 관계없이 자동으로 적절한 간격 적용

### Legend (폼 제목)

```jsx
<Legend>Account Settings</Legend>

// 스타일
text-base/6 sm:text-sm/6     /* 반응형 크기 */
font-semibold                 /* 굵은 글씨 */
text-zinc-950 dark:text-white /* 테마 색상 */
data-disabled:opacity-50      /* 비활성화 시 흐림 */
```

### Field vs CheckboxField vs RadioField vs SwitchField

#### Field (기본)
```css
/* 수직 레이아웃 (블록 요소) */
display: block

/* 자동 간격 */
[&>label+input]:mt-3
[&>input+description]:mt-3
```

#### CheckboxField
```css
/* 그리드 레이아웃 */
grid grid-cols-[1.125rem_1fr]  /* 체크박스 : 레이블 */

/* 체크박스: 1열 1행 */
*:data-[slot=control]:col-start-1
*:data-[slot=control]:row-start-1

/* 레이블: 2열 1행 */
*:data-[slot=label]:col-start-2

/* 설명: 2열 2행 */
*:data-[slot=description]:col-start-2
*:data-[slot=description]:row-start-2
```

#### SwitchField
```css
/* 2열 그리드 (레이블 | 스위치) */
grid grid-cols-[1fr_auto]

/* 레이블: 왼쪽 */
*:data-[slot=label]:col-start-1

/* 스위치: 오른쪽 */
*:data-[slot=control]:col-start-2
```

### ErrorMessage vs Description

```jsx
<Field>
  <Label>Email</Label>
  <Input invalid />
  
  {/* 기본 설명 (항상 표시) */}
  <Description>We'll never share your email.</Description>
  
  {/* 에러 메시지 (조건부 표시) */}
  {error && <ErrorMessage>{error}</ErrorMessage>}
</Field>

// 색상 차이
Description:   text-zinc-500 dark:text-zinc-400
ErrorMessage:  text-red-600 dark:text-red-500
```

---

## 고급 CSS 기법

### 1. Data Attribute Selectors

#### 기본 문법
```css
/* 속성 존재 */
data-[slot=icon]              → [data-slot="icon"]

/* 상태 (Headless UI) */
data-checked                  → [data-headlessui-state~="checked"]
data-hover                    → [data-headlessui-state~="hover"]
data-focus                    → [data-headlessui-state~="focus"]
data-disabled                 → [data-headlessui-state~="disabled"]
data-invalid                  → [data-headlessui-state~="invalid"]
data-active                   → [data-headlessui-state~="active"]
data-indeterminate            → [data-headlessui-state~="indeterminate"]
```

#### 복합 상태
```css
/* 체크됨 AND 호버 */
group-data-checked:group-data-hover:border-transparent

/* 체크됨 AND 비활성화 */
group-data-checked:group-data-disabled:bg-white
```

### 2. Arbitrary Properties (임의 속성)

```css
/* 커스텀 값 */
size-4.5              → width: 1.125rem; height: 1.125rem;
rounded-[0.3125rem]   → border-radius: 0.3125rem;
border-[4.5px]        → border-width: 4.5px;

/* CSS 변수 */
bg-(--switch-bg)      → background-color: var(--switch-bg);
text-(--btn-icon)     → color: var(--btn-icon);
```

### 3. Descendant Selectors (하위 선택자)

```css
/* 모든 자식 */
*:data-[slot=icon]

/* 첫 번째 자식 */
*:first:data-[slot=icon]

/* 마지막 자식 */
*:last:data-[slot=icon]

/* N번째가 아닌 마지막 */
*:not-nth-2:last:data-[slot=icon]  /* 2번째 요소가 아니면서 마지막 */
```

### 4. Group State Propagation

```css
/* 부모 상태 → 자식 적용 */
group                                      /* 부모에 설정 */
group-data-checked:bg-blue-500            /* 자식에서 부모 상태 참조 */

/* 예시 */
<div className="group">
  <input type="checkbox" />  {/* data-checked 상태 */}
  <span className="group-data-checked:bg-blue-500" />
</div>
```

### 5. Has Selector (부모 선택자)

```css
/* 자식 상태 → 부모 적용 */
has-data-[slot=description]              /* 설명 자식 있으면 */
has-[[data-slot=icon]:first-child]       /* 첫 아이콘 자식 있으면 */

/* 예시: 아이콘 있을 때 패딩 조정 */
has-[[data-slot=icon]:first-child]:[&_input]:pl-10
```

**해석**:
1. `has-[[data-slot=icon]:first-child]`: 첫 자식이 아이콘이면
2. `:[&_input]`: 그 안의 input 요소에
3. `:pl-10`: 왼쪽 패딩 40px

### 6. Forced Colors Mode

고대비 모드 (Windows High Contrast) 지원:

```css
/* 시스템 색상 사용 */
forced-colors:[--btn-icon:ButtonText]
forced-colors:bg-[Highlight]
forced-colors:text-[HighlightText]
forced-colors:border-[Canvas]

/* 아웃라인 강제 표시 */
forced-colors:outline
```

**시스템 색상**:
- `ButtonText`: 버튼 텍스트 색상
- `Highlight`: 선택/강조 배경
- `HighlightText`: 선택/강조 텍스트
- `Canvas`: 기본 배경
- `CanvasText`: 기본 텍스트

### 7. Container-Based Spacing

```css
/* 컨테이너 쿼리 변수 */
--gutter: --spacing(8)           /* 기본 32px */
px-(--gutter)                     /* 동적 패딩 */

/* 커스텀 Gutter */
className="[--gutter:--spacing(6)]"  /* 이 요소만 24px */
```

### 8. Pseudo-Element Stacking

```css
/* ::before (배경 레이어) */
before:absolute before:inset-0 before:-z-10
before:bg-white before:shadow-sm

/* ::after (오버레이 레이어) */
after:absolute after:inset-0 after:-z-10
after:bg-white/10
```

**Z-Index 순서**:
```
실제 요소 (z-index: 0)
  ↓
::before (z-index: -10)  ← 배경
  ↓
::after (z-index: -10)   ← 오버레이
```

### 9. Ring vs Border

#### Border (외부)
```css
border border-zinc-950/10      /* 1px 실선 보더 */
```

#### Ring (외부 + 겹침)
```css
ring-1 ring-zinc-950/10        /* 1px 아웃라인 (겹치지 않음) */
ring-inset                     /* 내부 링 */
```

**차이점**:
- Border: 요소 크기에 포함 (box-sizing 영향)
- Ring: 아웃라인, 요소 크기 불변

### 10. Opacity Layering (투명도 레이어)

```css
/* 색상 + 알파 채널 */
bg-zinc-950/10        → rgba(9, 9, 11, 0.1)
bg-white/5            → rgba(255, 255, 255, 0.05)
border-red-500/50     → rgba(239, 68, 68, 0.5)

/* 다중 레이어 */
bg-white/75 backdrop-blur-xl  /* 반투명 + 블러 = Glass Morphism */
```

---

## 🎨 컬러 매핑 가이드

### Checkbox/Radio/Switch 공통 색상

각 컴포넌트는 22가지 색상 프리셋 제공:

```jsx
// 중립
color="dark/zinc"  color="light"  color="dark/white"
color="dark"       color="white"  color="zinc"

// 파랑 계열
color="indigo"  color="blue"  color="sky"  color="cyan"

// 초록 계열
color="green"  color="emerald"  color="teal"  color="lime"

// 노랑/주황 계열
color="yellow"  color="amber"  color="orange"

// 빨강/핑크 계열
color="red"  color="rose"  color="pink"

// 보라 계열
color="violet"  color="purple"  color="fuchsia"
```

### 밝은 색상 (Amber, Yellow, Lime, Cyan)

**특징**: 체크마크/인디케이터가 **어두운 색** (950)

```css
/* Yellow 예시 */
[--checkbox-check:var(--color-yellow-950)]        /* 체크마크: 거의 검정 */
[--checkbox-checked-bg:var(--color-yellow-300)]   /* 배경: 밝은 노랑 */
```

**이유**: 대비 확보 (접근성)

### 색상별 사용 예시

```jsx
// 성공/완료
<Checkbox color="green">Task completed</Checkbox>
<Switch color="emerald" checked />

// 경고
<Radio color="amber">Warning level 2</Radio>

// 오류
<Checkbox color="red">Critical issue</Checkbox>

// 정보
<Switch color="blue">Enable notifications</Switch>

// 기본/중립
<Checkbox color="dark/zinc">Default option</Checkbox>
```

---

## 🧩 실전 활용 예제

### 1. 다단계 체크박스

```jsx
<CheckboxGroup>
  <CheckboxField>
    <Checkbox 
      checked={allChecked} 
      indeterminate={someChecked && !allChecked}
      onChange={handleSelectAll}
    />
    <Label>Select All</Label>
  </CheckboxField>
  
  {items.map(item => (
    <CheckboxField key={item.id}>
      <Checkbox 
        checked={item.checked}
        onChange={() => handleToggle(item.id)}
      />
      <Label>{item.name}</Label>
    </CheckboxField>
  ))}
</CheckboxGroup>
```

### 2. 라디오 그룹 (카드 스타일)

```jsx
<RadioGroup value={plan} onChange={setPlan}>
  {plans.map(plan => (
    <RadioField key={plan.id} className="
      cursor-pointer rounded-lg border p-4
      has-[[data-checked]]:border-blue-500
      has-[[data-checked]]:bg-blue-50
    ">
      <Radio value={plan.id} color="blue" />
      <div>
        <Label className="font-semibold">{plan.name}</Label>
        <Description>{plan.description}</Description>
        <Text className="mt-2 text-lg font-bold">
          ${plan.price}/month
        </Text>
      </div>
    </RadioField>
  ))}
</RadioGroup>
```

### 3. 스위치 설정 패널

```jsx
<FieldGroup>
  <SwitchField>
    <Label>Email Notifications</Label>
    <Description>
      Receive email about your account activity
    </Description>
    <Switch 
      checked={notifications.email}
      onChange={v => setNotifications({...notifications, email: v})}
      color="blue"
    />
  </SwitchField>
  
  <SwitchField>
    <Label>Push Notifications</Label>
    <Description>
      Receive push notifications on your devices
    </Description>
    <Switch 
      checked={notifications.push}
      onChange={v => setNotifications({...notifications, push: v})}
      color="blue"
    />
  </SwitchField>
  
  <SwitchField>
    <Label>SMS Notifications</Label>
    <Description>
      Receive text messages about your account
    </Description>
    <Switch 
      checked={notifications.sms}
      onChange={v => setNotifications({...notifications, sms: v})}
      color="blue"
      disabled={!notifications.email}  // 이메일 활성화 필요
    />
  </SwitchField>
</FieldGroup>
```

### 4. 동적 폼 검증

```jsx
<Fieldset>
  <Legend>Create Account</Legend>
  
  <FieldGroup>
    <Field>
      <Label>Email</Label>
      <Input 
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        invalid={!!errors.email}
      />
      {errors.email ? (
        <ErrorMessage>{errors.email}</ErrorMessage>
      ) : (
        <Description>We'll never share your email.</Description>
      )}
    </Field>
    
    <Field>
      <Label>Password</Label>
      <Input 
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        invalid={!!errors.password}
      />
      {errors.password && (
        <ErrorMessage>{errors.password}</ErrorMessage>
      )}
    </Field>
    
    <CheckboxField>
      <Checkbox 
        checked={agree}
        onChange={setAgree}
        color="blue"
      />
      <Label>
        I agree to the <Link href="/terms">Terms of Service</Link>
      </Label>
    </CheckboxField>
  </FieldGroup>
  
  <Button 
    type="submit" 
    color="blue"
    disabled={!agree || !!Object.keys(errors).length}
  >
    Create Account
  </Button>
</Fieldset>
```

---

## 🔍 디버깅 팁

### 1. Data Attributes 확인

브라우저 개발자 도구에서:
```html
<div data-headlessui-state="checked hover">
  <!-- checked와 hover 상태 동시 활성화 -->
</div>
```

### 2. CSS 변수 검사

```javascript
// 현재 적용된 CSS 변수 확인
const element = document.querySelector('.checkbox')
const styles = getComputedStyle(element)
console.log(styles.getPropertyValue('--checkbox-checked-bg'))
```

### 3. 강제 상태 테스트

```jsx
// 개발 중 모든 상태 동시 확인
<Checkbox data-checked data-hover data-focus />
<Radio data-checked data-disabled />
<Switch data-checked data-changing />
```

---

## 🎓 베스트 프랙티스

### 1. 접근성

```jsx
// ✅ 좋음
<CheckboxField>
  <Checkbox id="agree" />
  <Label htmlFor="agree">I agree</Label>
</CheckboxField>

// ❌ 나쁨
<div>
  <input type="checkbox" />
  <span>I agree</span>  {/* 레이블 연결 없음 */}
</div>
```

### 2. 의미론적 그룹화

```jsx
// ✅ 좋음
<Fieldset>
  <Legend>Notification Preferences</Legend>
  <CheckboxGroup>
    {/* 체크박스들 */}
  </CheckboxGroup>
</Fieldset>

// ❌ 나쁨
<div>
  <h3>Notification Preferences</h3>
  <div>
    {/* 체크박스들 (의미론적 연결 없음) */}
  </div>
</div>
```

### 3. 에러 처리

```jsx
// ✅ 좋음
<Field>
  <Label>Email</Label>
  <Input invalid={!!error} />
  {error && <ErrorMessage>{error}</ErrorMessage>}
</Field>

// ❌ 나쁨
<div>
  <label style={{ color: error ? 'red' : 'black' }}>
    Email
  </label>
  <input />
  <span style={{ color: 'red' }}>{error}</span>
</div>
```

### 4. 색상 일관성

```jsx
// ✅ 좋음: 앱 전체에서 동일한 액센트 색상
const ACCENT_COLOR = 'blue'

<Checkbox color={ACCENT_COLOR} />
<Radio color={ACCENT_COLOR} />
<Switch color={ACCENT_COLOR} />
<Button color={ACCENT_COLOR} />

// ❌ 나쁨: 각 컴포넌트마다 다른 색상
<Checkbox color="green" />
<Radio color="blue" />
<Switch color="purple" />
```

---

## 📊 성능 고려사항

### 1. 대량 체크박스 최적화

```jsx
// ✅ 좋음: 가상화
import { FixedSizeList } from 'react-window'

<FixedSizeList
  height={400}
  itemCount={items.length}
  itemSize={50}
>
  {({ index, style }) => (
    <CheckboxField style={style}>
      <Checkbox checked={items[index].checked} />
      <Label>{items[index].name}</Label>
    </CheckboxField>
  )}
</FixedSizeList>

// ❌ 나쁨: 모든 항목 렌더링
{items.map(item => (
  <CheckboxField key={item.id}>
    <Checkbox checked={item.checked} />
    <Label>{item.name}</Label>
  </CheckboxField>
))}
```

### 2. 불필요한 리렌더링 방지

```jsx
// ✅ 좋음: 메모이제이션
const CheckboxItem = memo(({ item, onToggle }) => (
  <CheckboxField>
    <Checkbox 
      checked={item.checked}
      onChange={() => onToggle(item.id)}
    />
    <Label>{item.name}</Label>
  </CheckboxField>
))

// ❌ 나쁨: 인라인 함수
{items.map(item => (
  <CheckboxField>
    <Checkbox 
      onChange={() => handleToggle(item.id)}  // 매번 새 함수 생성
    />
  </CheckboxField>
))}
```

---

**작성일**: 2025-10-28  
**버전**: Catalyst UI Kit 1.0 - Form Components  
**분석자**: GenSpark AI Developer
