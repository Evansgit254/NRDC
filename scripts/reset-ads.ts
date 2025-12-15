
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Deleting existing ads...');
    await prisma.advertisement.deleteMany({});

    console.log('Creating commercial ad simulations...');

    // 1. Home Top - Leaderboard (728x90) - Tech/Business
    const homeTopCode = `
    <div style="width: 100%; max-width: 728px; height: 90px; margin: 0 auto; background: #fff; border: 1px solid #ddd; position: relative; font-family: Arial, sans-serif; overflow: hidden; display: flex; align-items: center; justify-content: space-between; padding: 0 20px; box-sizing: border-box; cursor: pointer;">
      <div style="position: absolute; top: 0; right: 0; background: #f0f0f0; color: #888; font-size: 10px; padding: 2px 4px;">AdChoices ▶</div>
      <div style="display: flex; align-items: center; gap: 15px;">
        <div style="width: 50px; height: 50px; background: #0066cc; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">CLOUD</div>
        <div>
          <div style="color: #333; font-weight: bold; font-size: 16px;">Enterprise Cloud Solutions</div>
          <div style="color: #666; font-size: 12px;">Scale your business with 99.9% uptime. Start free trial.</div>
        </div>
      </div>
      <div style="background: #0066cc; color: white; padding: 8px 20px; border-radius: 4px; font-size: 14px; font-weight: bold;">Learn More</div>
    </div>
  `;

    await prisma.advertisement.create({
        data: {
            name: 'Commercial - Cloud Hosting (728x90)',
            type: 'CUSTOM',
            placement: 'HOME_TOP',
            code: homeTopCode,
            active: true,
            priority: 10
        }
    });

    // 2. Home Bottom - Leaderboard (728x90) - Travel
    const homeBottomCode = `
    <div style="width: 100%; max-width: 728px; height: 90px; margin: 0 auto; background: linear-gradient(90deg, #ff9966, #ff5e62); position: relative; font-family: Arial, sans-serif; overflow: hidden; display: flex; align-items: center; justify-content: space-between; padding: 0 20px; box-sizing: border-box; cursor: pointer;">
      <div style="position: absolute; top: 0; right: 0; background: rgba(255,255,255,0.8); color: #444; font-size: 10px; padding: 2px 4px;">AdChoices ▶</div>
      <div style="display: flex; align-items: center; gap: 15px;">
        <div style="font-size: 40px;">✈️</div>
        <div>
          <div style="color: white; font-weight: bold; font-size: 18px; text-shadow: 0 1px 2px rgba(0,0,0,0.2);">Dream Vacation Deals</div>
          <div style="color: white; font-size: 13px;">Up to 50% off flights to Paris, Tokyo, and New York.</div>
        </div>
      </div>
      <div style="background: white; color: #ff5e62; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: bold; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">Book Now</div>
    </div>
  `;

    await prisma.advertisement.create({
        data: {
            name: 'Commercial - Travel Deals (728x90)',
            type: 'CUSTOM',
            placement: 'HOME_BOTTOM',
            code: homeBottomCode,
            active: true,
            priority: 10
        }
    });

    // 3. Blog Top - Medium Rectangle (300x250) - Retail
    const blogTopCode = `
    <div style="width: 300px; height: 250px; margin: 0 auto; background: #fff; border: 1px solid #ddd; position: relative; font-family: Arial, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 20px; box-sizing: border-box; cursor: pointer;">
      <div style="position: absolute; top: 0; right: 0; background: #f0f0f0; color: #888; font-size: 10px; padding: 2px 4px;">Ad</div>
      <div style="width: 100px; height: 100px; background: #f8f9fa; border-radius: 8px; margin-bottom: 15px; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 40px;">👟</span>
      </div>
      <div style="color: #333; font-weight: bold; font-size: 18px; margin-bottom: 5px;">Summer Sale</div>
      <div style="color: #666; font-size: 14px; margin-bottom: 15px;">Get the latest running gear. Free shipping on orders over $50.</div>
      <div style="background: #222; color: white; padding: 10px 25px; border-radius: 4px; font-size: 14px; font-weight: bold;">Shop Now</div>
    </div>
  `;

    await prisma.advertisement.create({
        data: {
            name: 'Commercial - Retail (300x250)',
            type: 'CUSTOM',
            placement: 'BLOG_TOP',
            code: blogTopCode,
            active: true,
            priority: 10
        }
    });

    // 4. Programs Top - Medium Rectangle (300x250) - Finance
    const programsTopCode = `
    <div style="width: 300px; height: 250px; margin: 0 auto; background: #003366; position: relative; font-family: Arial, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 20px; box-sizing: border-box; cursor: pointer; color: white;">
      <div style="position: absolute; top: 0; right: 0; background: rgba(255,255,255,0.2); color: #ccc; font-size: 10px; padding: 2px 4px;">Ad</div>
      <div style="font-size: 16px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px; opacity: 0.8;">Global Bank</div>
      <div style="font-weight: bold; font-size: 24px; margin-bottom: 10px;">High Yield Savings</div>
      <div style="font-size: 14px; margin-bottom: 20px; opacity: 0.9;">Earn 4.5% APY with our new savings account. No fees.</div>
      <div style="background: #ffcc00; color: #003366; padding: 10px 25px; border-radius: 4px; font-size: 14px; font-weight: bold;">Open Account</div>
    </div>
  `;

    await prisma.advertisement.create({
        data: {
            name: 'Commercial - Finance (300x250)',
            type: 'CUSTOM',
            placement: 'PROGRAMS_TOP',
            code: programsTopCode,
            active: true,
            priority: 10
        }
    });

    console.log('Commercial ads created successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
