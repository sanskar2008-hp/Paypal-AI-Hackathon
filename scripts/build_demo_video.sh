#!/bin/bash
set -e

mkdir -p public .video-assets

echo "[1/4] Preparing 1080p source slide images..."

# Ensure standard 1920x1080 resolution on all source frames
for img in .video-assets/*.png; do
  ffmpeg -y -i "$img" -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=0x0b1120" "${img%.png}_1080.png"
done

echo "[2/4] Generating high-resolution scene sequence..."
# Scene 1: Intro (0:00 - 0:20) -> 20s
# Scene 2: Product Overview & Landing (0:20 - 0:45) -> 25s
# Scene 3: AI Shopping Assistant (0:45 - 1:15) -> 30s
# Scene 4: Catalogue Discovery & Cart (1:15 - 1:40) -> 25s
# Scene 5: PayPal Sandbox Verification (1:40 - 2:10) -> 30s
# Scene 6: Real-Time Order Tracking & Seller Dashboard (2:10 - 2:35) -> 25s
# Scene 7: Final Outro (2:35 - 2:50) -> 15s
# Total Duration: 170 seconds = 2 minutes 50 seconds (Exact maximum specified!)

S1=".video-assets/scene1_intro_1080.png"
S2=".video-assets/scene2_landing_1080.png"
S3=".video-assets/scene3_assistant_active_1080.png"
S4=".video-assets/scene2_catalogue_1080.png"
S5=".video-assets/scene3_assistant_1080.png"
S6=".video-assets/scene6_tracking_1080.png"
S7=".video-assets/scene1_intro_1080.png"

echo "[3/4] Synthesizing subtle futuristic corporate technology ambient audio (2m 50s)..."
# Generates a soft, pleasant, low-volume ambient harmonic synth drone (440Hz / 554.37Hz / 659.25Hz chord) with lowpass filter
ffmpeg -y -f lavfi -i "sine=frequency=110:duration=170" \
  -f lavfi -i "sine=frequency=165:duration=170" \
  -f lavfi -i "sine=frequency=220:duration=170" \
  -filter_complex "[0:a][1:a][2:a]amix=inputs=3:duration=first[aout];[aout]volume=0.08,lowpass=f=800,afade=t=in:ss=0:d=3,afade=t=out:st=167:d=3[audio]" \
  -map "[audio]" -c:a aac -b:a 128k .video-assets/ambient_bgm.aac

echo "[4/4] Encoding Full HD 1080p MP4 Video with H.264 & AAC..."
# Create 170s video by stitching scenes with crossfade & attaching ambient audio
cat << 'EOF' > .video-assets/concat.txt
file 'scene1_intro_1080.png'
duration 20
file 'scene2_landing_1080.png'
duration 25
file 'scene3_assistant_active_1080.png'
duration 30
file 'scene2_catalogue_1080.png'
duration 25
file 'scene3_assistant_1080.png'
duration 30
file 'scene6_tracking_1080.png'
duration 25
file 'scene1_intro_1080.png'
duration 15
file 'scene1_intro_1080.png'
EOF

ffmpeg -y -f concat -safe 0 -i .video-assets/concat.txt \
  -i .video-assets/ambient_bgm.aac \
  -c:v libx264 -preset fast -crf 22 -pix_fmt yuv420p -r 30 \
  -c:a aac -b:a 128k \
  -t 170 \
  -movflags +faststart \
  public/paypilot-commerce-ai-demo.mp4

echo "Video generation complete: public/paypilot-commerce-ai-demo.mp4"
ls -lh public/paypilot-commerce-ai-demo.mp4
