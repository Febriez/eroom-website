export default function CookiesPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">쿠키 정책</h1>

      <div className="prose prose-invert max-w-none">
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <p className="text-gray-400 text-sm">최종 업데이트: 2025년 6월 15일</p>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">1. 쿠키란 무엇인가요?</h2>
          <p>쿠키는 사용자가 웹사이트를 방문할 때 사용자의 기기에 저장되는 작은 텍스트 파일입니다. 쿠키는 웹사이트가 사용자의 기기를 인식하고, 사용자 경험을 향상시키며, 맞춤형 서비스를 제공하는 데 도움을 줍니다.</p>
          <p className="mt-3">쿠키 외에도 웹 비콘, 픽셀 태그, 로컬 스토리지 등의 유사한 기술이 사용될 수 있으며, 본 정책에서는 이러한 모든 기술을 &quot;쿠키&quot;로 통칭합니다.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">2. 당사가 사용하는 쿠키 유형</h2>
          <p>당사는 다음과 같은 유형의 쿠키를 사용합니다:</p>

          <h3 className="text-xl font-semibold mt-6 mb-3">필수 쿠키</h3>
          <p>웹사이트의 기본적인 기능을 활성화하는 데 필요한 쿠키입니다. 이러한 쿠키 없이는 웹사이트가 제대로 작동하지 않을 수 있습니다.</p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li><strong>세션 쿠키</strong>: 로그인 상태 유지, 장바구니 관리 등</li>
            <li><strong>보안 쿠키</strong>: 사용자 인증 및 보안 유지</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">선호 설정 쿠키</h3>
          <p>사용자의 웹사이트 사용 경험을 향상시키기 위한 쿠키입니다.</p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li><strong>언어 설정</strong>: 사용자가 선택한 언어 저장</li>
            <li><strong>테마 설정</strong>: 다크 모드 등 사용자 인터페이스 설정 저장</li>
            <li><strong>알림 설정</strong>: 사용자의 알림 환경설정 저장</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">분석 쿠키</h3>
          <p>웹사이트 사용 방식에 대한 정보를 수집하여 서비스를 개선하는 데 사용되는 쿠키입니다.</p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li><strong>트래픽 분석</strong>: 방문 페이지, 체류 시간, 이탈률 등 측정</li>
            <li><strong>사용자 행동 분석</strong>: 클릭, 스크롤, 마우스 이동 등 사용자 행동 패턴 분석</li>
            <li><strong>오류 추적</strong>: 웹사이트 오류 발생 시 관련 정보 수집</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">마케팅 쿠키</h3>
          <p>사용자의 관심사에 기반한 광고를 제공하기 위해 사용되는 쿠키입니다.</p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li><strong>타겟 광고</strong>: 사용자의 관심사에 맞는 광고 제공</li>
            <li><strong>리마케팅</strong>: 이전에 방문한 사용자에게 관련 광고 표시</li>
            <li><strong>소셜 미디어 쿠키</strong>: 소셜 미디어 기능 및 공유 버튼 활성화</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">3. 제3자 쿠키</h2>
          <p>일부 쿠키는 당사가 아닌 제3자(예: Google Analytics, Facebook, YouTube 등)에 의해 설정됩니다. 이러한 제3자는 당사 웹사이트를 통해 귀하의 기기에 쿠키를 설정하여 정보를 수집할 수 있습니다.</p>
          <p className="mt-3">주요 제3자 쿠키 제공자:</p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li><strong>Google Analytics</strong>: 웹사이트 트래픽 및 사용자 행동 분석</li>
            <li><strong>Google 광고</strong>: 맞춤형 광고 제공</li>
            <li><strong>Facebook</strong>: 소셜 공유 기능 및 타겟 광고</li>
            <li><strong>Firebase</strong>: 사용자 인증 및 분석</li>
          </ul>
          <p className="mt-3">제3자 쿠키에 대한 자세한 내용은 해당 제3자의 개인정보 처리방침을 참조하시기 바랍니다.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">4. 쿠키 관리 및 설정 방법</h2>
          <p>대부분의 웹 브라우저는 쿠키를 자동으로 허용하도록 설정되어 있지만, 사용자는 브라우저 설정을 변경하여 쿠키를 허용하거나 거부할 수 있습니다.</p>

          <h3 className="text-xl font-semibold mt-6 mb-3">브라우저 설정을 통한 쿠키 관리</h3>
          <p>주요 브라우저에서 쿠키를 관리하는 방법:</p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li><strong>Chrome</strong>: 설정 → 개인정보 및 보안 → 쿠키 및 기타 사이트 데이터</li>
            <li><strong>Firefox</strong>: 환경설정 → 개인정보 및 보안 → 쿠키 및 사이트 데이터</li>
            <li><strong>Safari</strong>: 환경설정 → 개인정보 보호 → 쿠키 및 웹사이트 데이터</li>
            <li><strong>Edge</strong>: 설정 → 쿠키 및 사이트 권한 → 쿠키 및 사이트 데이터 관리</li>
          </ul>
          <p className="mt-3">모바일 기기에서도 브라우저 설정을 통해 쿠키를 관리할 수 있습니다.</p>

          <h3 className="text-xl font-semibold mt-6 mb-3">당사 웹사이트에서의 쿠키 관리</h3>
          <p>당사는 웹사이트 첫 방문 시 쿠키 동의 배너를 통해 필수적이지 않은 쿠키 사용에 대한 동의를 요청합니다. 이 배너에서 다음과 같은 옵션을 선택할 수 있습니다:</p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li>모든 쿠키 허용</li>
            <li>필수 쿠키만 허용</li>
            <li>선호 설정에 따라 쿠키 선택</li>
          </ul>
          <p className="mt-3">언제든지 당사 웹사이트 하단의 "쿠키 설정"을 클릭하여 쿠키 환경설정을 변경할 수 있습니다.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">5. 쿠키 거부의 영향</h2>
          <p>필수 쿠키를 제외한 모든 쿠키를 거부하더라도 당사 웹사이트의 대부분의 기능을 이용할 수 있습니다. 그러나 일부 맞춤형 기능과 개인화된 서비스는 제한될 수 있습니다.</p>
          <p className="mt-3">쿠키 거부 시 다음과 같은 제한이 있을 수 있습니다:</p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li>사용자 선호도 및 설정이 저장되지 않음</li>
            <li>일부 맞춤형 콘텐츠 및 추천 기능 제한</li>
            <li>로그인 상태 유지 불가능(매번 다시 로그인 필요)</li>
            <li>관심 기반 광고 대신 무작위 광고 표시</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">6. 데이터 보존 기간</h2>
          <p>쿠키의 보존 기간은 쿠키 유형에 따라 다릅니다:</p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li><strong>세션 쿠키</strong>: 브라우저 종료 시 자동 삭제됨</li>
            <li><strong>영구 쿠키</strong>: 설정된 만료일까지 유지됨(일반적으로 몇 개월에서 최대 2년)</li>
          </ul>
          <p className="mt-3">당사가 사용하는 대부분의 영구 쿠키는 13개월을 초과하지 않는 기간 동안 유지됩니다.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">7. 쿠키 정책 변경</h2>
          <p>당사는 본 쿠키 정책을 정기적으로 검토하고 업데이트할 수 있습니다. 중요한 변경사항이 있을 경우, 웹사이트 공지 또는 이메일을 통해 알려드립니다.</p>
          <p className="mt-3">최신 버전의 쿠키 정책은 항상 이 페이지에서 확인할 수 있으며, 페이지 상단에 최종 업데이트 날짜가 표시됩니다.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">8. 문의하기</h2>
          <p>쿠키 사용에 관한 질문이나 우려사항이 있으시면 다음 연락처로 문의해 주십시오:</p>
          <div className="mt-3">
            <p><strong>개인정보 보호책임자</strong></p>
            <p>이메일: privacy@example.com</p>
            <p>전화번호: 02-123-4567</p>
          </div>
          <p className="mt-3">더 자세한 개인정보 처리에 대한 정보는 당사의 <a href="/privacy" className="text-green-400 hover:underline">개인정보 처리방침</a>을 참조하시기 바랍니다.</p>
        </section>
      </div>
    </div>
  );
}
