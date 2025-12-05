/**
 * @file Footer.tsx
 * @description Footer 컴포넌트
 *
 * 사이트 하단에 표시되는 Footer 컴포넌트입니다.
 * 카테고리 링크, 고객센터, SNS 아이콘, 결제수단 아이콘, 카피라이트를 포함합니다.
 */

import Link from "next/link";
import { Github, Twitter, Instagram, Facebook, CreditCard, Smartphone } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const sinceYear = 2024;

  return (
    <footer className="border-t-4 border-blue-600 dark:border-blue-500 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-8 py-12 lg:py-16">
        {/* 메인 Footer 컨텐츠 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* 브랜드 정보 */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              SaaS Template
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              최고의 쇼핑 경험을 제공합니다.
            </p>
            {/* SNS 아이콘 */}
            <div className="flex gap-3">
              <Link
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </Link>
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* 카테고리 링크 */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4 uppercase tracking-wide">
              카테고리
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products?category=Fashion"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Fashion
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=Beauty"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Beauty
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=Tech"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Tech
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=Books"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Books
                </Link>
              </li>
            </ul>
          </div>

          {/* 고객센터 */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4 uppercase tracking-wide">
              고객센터
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  자주 묻는 질문
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  문의하기
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  배송 안내
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  반품/교환
                </Link>
              </li>
            </ul>
          </div>

          {/* 회사 정보 */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4 uppercase tracking-wide">
              회사 정보
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  회사 소개
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  이용약관
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  개인정보처리방침
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 결제수단 아이콘 */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                안전한 결제 수단
              </p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <CreditCard className="w-5 h-5" />
                  <span className="text-xs">신용카드</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Smartphone className="w-5 h-5" />
                  <span className="text-xs">모바일 결제</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <CreditCard className="w-5 h-5" />
                  <span className="text-xs">계좌이체</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 카피라이트 */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <p>
              © {currentYear} SaaS Template. All rights reserved.
            </p>
            <p>
              Since {sinceYear}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

