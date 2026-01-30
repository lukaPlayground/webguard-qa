# 아이콘 생성 가이드

WebGuard QA는 SVG 아이콘을 제공합니다. PNG 아이콘이 필요한 경우 다음 방법을 사용하세요:

## 방법 1: 온라인 변환 도구

1. https://cloudconvert.com/svg-to-png 방문
2. `icon.svg` 파일 업로드
3. 다음 크기로 변환:
   - 16x16 → icon16.png
   - 32x32 → icon32.png
   - 48x48 → icon48.png
   - 128x128 → icon128.png

## 방법 2: ImageMagick (CLI)

```bash
# ImageMagick 설치 (macOS)
brew install imagemagick

# 변환
convert icon.svg -resize 16x16 icon16.png
convert icon.svg -resize 32x32 icon32.png
convert icon.svg -resize 48x48 icon48.png
convert icon.svg -resize 128x128 icon128.png
```

## 방법 3: Inkscape (GUI)

1. Inkscape 설치: https://inkscape.org/
2. `icon.svg` 파일 열기
3. File → Export PNG Image
4. 원하는 크기로 내보내기

## 임시 해결책

PNG 파일이 없어도 extension은 작동하지만, 아이콘이 표시되지 않습니다.
개발 중에는 이대로 사용 가능하며, 배포 전에 PNG 파일을 추가하면 됩니다.
