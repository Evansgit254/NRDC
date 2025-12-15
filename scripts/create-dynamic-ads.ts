import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Deleting existing ads...');
    await prisma.advertisement.deleteMany({});

    console.log('Creating dynamic, visually appealing ads...');

    // 1. Home Top - Animated Gradient Banner
    const homeTopCode = `
    <div style="
      width: 100%; 
      max-width: 728px; 
      height: 90px; 
      margin: 0 auto;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      background-size: 200% 200%;
      animation: gradientShift 3s ease infinite;
      border-radius: 12px;
      position: relative;
      font-family: 'Inter', Arial, sans-serif;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      box-sizing: border-box;
      cursor: pointer;
      box-shadow: 0 10px 40px rgba(102, 126, 234, 0.4);
      transition: all 0.3s ease;
    " onmouseover="this.style.transform='translateY(-2px) scale(1.01)'; this.style.boxShadow='0 15px 50px rgba(102, 126, 234, 0.5)';" onmouseout="this.style.transform=''; this.style.boxShadow='0 10px 40px rgba(102, 126, 234, 0.4)';">
      <!-- AdChoices -->
      <div style="position: absolute; top: 4px; right: 4px; background: rgba(255,255,255,0.9); color: #666; font-size: 9px; padding: 2px 5px; border-radius: 3px; font-weight: 500;">AdChoices ▶</div>
      
      <!-- Content -->
      <div style="display: flex; align-items: center; gap: 16px; animation: slideInLeft 0.6s ease;">
        <div style="width: 50px; height: 50px; background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); border-radius: 10px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
          <span style="font-size: 24px;">☁️</span>
        </div>
        <div>
          <div style="color: white; font-weight: 700; font-size: 17px; text-shadow: 0 2px 4px rgba(0,0,0,0.1); letter-spacing: -0.3px;">Premium Cloud Solutions</div>
          <div style="color: rgba(255,255,255,0.95); font-size: 12px; margin-top: 2px;">99.9% uptime • Enterprise-grade security</div>
        </div>
      </div>
      
      <div style="background: white; color: #667eea; padding: 10px 22px; border-radius: 8px; font-size: 13px; font-weight: 700; box-shadow: 0 4px 15px rgba(0,0,0,0.15); animation: pulse 2s ease infinite;">
        Start Free →
      </div>

      <style>
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background: -position: 100% 50%; }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      </style>
    </div>
  `;

    await prisma.advertisement.create({
        data: {
            name: 'Dynamic Cloud Ad (728x90)',
            type: 'CUSTOM',
            placement: 'HOME_TOP',
            code: homeTopCode,
            active: true,
            priority: 10
        }
    });

    // 2. Home Bottom - Modern Travel Ad with parallax effect
    const homeBottomCode = `
    <div style="
      width: 100%;
      max-width: 728px;
      height: 90px;
      margin: 0 auto;
      background: linear-gradient(120deg, #f093fb 0%, #f5576c 100%);
      border-radius: 12px;
      position: relative;
      font-family: 'Inter', Arial, sans-serif;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      box-sizing: border-box;
      cursor: pointer;
      box-shadow: 0 10px 40px rgba(245, 87, 108, 0.3);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    " onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 15px 50px rgba(245, 87, 108, 0.4)';" onmouseout="this.style.transform=''; this.style.boxShadow='0 10px 40px rgba(245, 87, 108, 0.3)';">
      
      <!-- Animated background circles -->
      <div style="position: absolute; width: 100px; height: 100px; background: rgba(255,255,255,0.1); border-radius: 50%; top: -20px; left: 10%; animation: float 3s ease-in-out infinite;"></div>
      <div style="position: absolute; width: 60px; height: 60px; background: rgba(255,255,255,0.1); border-radius: 50%; bottom: -10px; right: 20%; animation: float 4s ease-in-out infinite 1s;"></div>
      
      <!-- AdChoices -->
      <div style="position: absolute; top: 4px; right: 4px; background: rgba(255,255,255,0.9); color: #666; font-size: 9px; padding: 2px 5px; border-radius: 3px; z-index: 10;">Ad</div>
      
      <!-- Content -->
      <div style="display: flex; align-items: center; gap: 14px; z-index: 5;">
        <div style="font-size: 36px; animation: bounce 2s ease infinite;">✈️</div>
        <div>
          <div style="color: white; font-weight: 700; font-size: 18px; text-shadow: 0 2px 8px rgba(0,0,0,0.2);">Dream Destinations Await</div>
          <div style="color: rgba(255,255,255,0.95); font-size: 12px;">Up to 60% off • Paris • Tokyo • NYC</div>
        </div>
      </div>
      
      <div style="background: white; color: #f5576c; padding: 10px 24px; border-radius: 25px; font-size: 13px; font-weight: 700; box-shadow: 0 4px 20px rgba(0,0,0,0.2); z-index: 5; white-space: nowrap;">
        Explore Deals
      </div>

      <style>
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      </style>
    </div>
  `;

    await prisma.advertisement.create({
        data: {
            name: 'Dynamic Travel Ad (728x90)',
            type: 'CUSTOM',
            placement: 'HOME_BOTTOM',
            code: homeBottomCode,
            active: true,
            priority: 10
        }
    });

    // 3. Blog - Product showcase with zoom effect
    const blogTopCode = `
    <div style="
      width: 300px;
      height: 250px;
      margin: 0 auto;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      border-radius: 16px;
      position: relative;
      font-family: 'Inter', Arial, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
      box-sizing: border-box;
      cursor: pointer;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      overflow: hidden;
    " onmouseover="this.style.transform='scale(1.03)'; this.style.boxShadow='0 15px 40px rgba(0,0,0,0.15)';" onmouseout="this.style.transform=''; this.style.boxShadow='0 10px 30px rgba(0,0,0,0.1)';">
      
      <!-- Ad label -->
      <div style="position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.5); color: white; font-size: 9px; padding: 3px 6px; border-radius: 4px; backdrop-filter: blur(10px);">Ad</div>
      
      <!-- Animated product icon -->
      <div style="width: 110px; height: 110px; background: white; border-radius: 50%; margin-bottom: 16px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 25px rgba(0,0,0,0.12); animation: rotateIn 0.8s ease, floatProduct 3s ease-in-out infinite;">
        <span style="font-size: 48px; animation: pulse 2s ease infinite;">👟</span>
      </div>
      
      <!-- Content -->
      <div style="text-align: center; animation: fadeIn 1s ease;">
        <div style="background: linear-gradient(90deg, #FF6B6B, #4ECDC4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-weight: 800; font-size: 20px; margin-bottom: 6px; letter-spacing: -0.5px;">
          Summer Collection
        </div>
        <div style="color: #666; font-size: 13px; margin-bottom: 18px; line-height: 1.4;">
          Premium sneakers • Free shipping • 30-day returns
        </div>
        <div style="background: #222; color: white; padding: 11px 28px; border-radius: 25px; font-size: 13px; font-weight: 700; display: inline-block; box-shadow: 0 4px 15px rgba(0,0,0,0.2); transition: all 0.3s ease;">
          Shop Now
        </div>
      </div>

      <style>
        @keyframes rotateIn {
          from { transform: rotate(-180deg) scale(0); opacity: 0; }
          to { transform: rotate(0deg) scale(1); opacity: 1; }
        }
        @keyframes floatProduct {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      </style>
    </div>
  `;

    await prisma.advertisement.create({
        data: {
            name: 'Dynamic Product Ad (300x250)',
            type: 'CUSTOM',
            placement: 'BLOG_TOP',
            code: blogTopCode,
            active: true,
            priority: 10
        }
    });

    // 4. Programs - Finance with shimmer effect
    const programsTopCode = `
    <div style="
      width: 300px;
      height: 250px;
      margin: 0 auto;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 16px;
      position: relative;
      font-family: 'Inter', Arial, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 28px;
      box-sizing: border-box;
      cursor: pointer;
      color: white;
      overflow: hidden;
      box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
      transition: all 0.3s ease;
    " onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 16px 45px rgba(102, 126, 234, 0.5)';" onmouseout="this.style.transform=''; this.style.boxShadow='0 12px 35px rgba(102, 126, 234, 0.4)';">
      
      <!-- Shimmer effect -->
      <div style="position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent); animation: shimmer 3s infinite;"></div>
      
      <!-- Ad label -->
      <div style="position: absolute; top: 8px; right: 8px; background: rgba(255,255,255,0.2); color: rgba(255,255,255,0.9); font-size: 9px; padding: 3px 6px; border-radius: 4px; backdrop-filter: blur(10px);">Ad</div>
      
      <!-- Content -->
      <div style="text-align: center; z-index: 1;">
        <div style="font-size: 14px; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 16px; opacity: 0.9; font-weight: 600; animation: fadeInDown 0.6s ease;">
          Premium Banking
        </div>
        <div style="font-weight: 800; font-size: 40px; margin-bottom: 8px; animation: scaleIn 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
          4.5% APY
        </div>
        <div style="font-size: 13px; margin-bottom: 22px; opacity: 0.95; line-height: 1.5;">
          High-yield savings account<br/>$0 fees • FDIC insured
        </div>
        <div style="background: #FFD700; color: #667eea; padding: 12px 30px; border-radius: 25px; font-size: 14px; font-weight: 700; display: inline-block; box-shadow: 0 6px 20px rgba(255, 215, 0, 0.3); animation: pulse 2s ease infinite;">
          Get Started
        </div>
      </div>

      <style>
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 200%; }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 0.9; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      </style>
    </div>
  `;

    await prisma.advertisement.create({
        data: {
            name: 'Dynamic Finance Ad (300x250)',
            type: 'CUSTOM',
            placement: 'PROGRAMS_TOP',
            code: programsTopCode,
            active: true,
            priority: 10
        }
    });

    console.log('✅ Dynamic, visually appealing ads created successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
