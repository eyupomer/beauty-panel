import { PrismaClient } from '@beautypanel/database';
import { hashPassword } from '../utils/password.utils';

const prisma = new PrismaClient();

async function createUser() {
  try {
    // Tenant ID'nizi buraya yazın
    const tenantId = 1; // Prisma Studio'dan tenant ID'nizi alın
    
    // Şifreyi hash'le
    const hashedPassword = await hashPassword('nu24xcx7n'); // İstediğiniz şifre
    
    // Kullanıcı oluştur
    const user = await prisma.user.create({
      data: {
        tenantId: tenantId,
        name: 'Kuaför Ömer',
        email: 'kuaforomer@gmail.com',
        passwordHash: hashedPassword,
        phone: '05304021357',
        title: 'Kuaför',
        role: 'STAFF',
        gender: 'MALE',
      },
    })
    console.log('User created:', user)
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createUser()