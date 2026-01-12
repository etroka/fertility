import Dexie from 'dexie';

export const db = new Dexie('FertilityOptimizationDB');

db.version(1).stores({
  users: 'id, email, createdAt',
  healthData: '++id, userId, encryptedData',
  checkIns: '++id, userId, date, [userId+date]',
  partnerships: 'userId, partnerId, pairingCode, sharedData',
  milestones: '++id, userId, type, achievedAt',
  analytics: '++id, userId, event, timestamp'
});

// Helper functions for database operations

export async function createUser(userData) {
  try {
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const user = {
      id: userId,
      email: userData.email,
      createdAt: new Date().toISOString(),
      passwordHash: userData.passwordHash,
      name: userData.name,
      age: userData.age,
      sex: userData.sex
    };
    await db.users.add(user);
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function getUserByEmail(email) {
  try {
    return await db.users.where('email').equals(email).first();
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
}

export async function saveHealthData(userId, data, encryptedData) {
  try {
    return await db.healthData.add({
      userId,
      encryptedData,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error saving health data:', error);
    throw error;
  }
}

export async function getHealthData(userId) {
  try {
    return await db.healthData.where('userId').equals(userId).last();
  } catch (error) {
    console.error('Error getting health data:', error);
    throw error;
  }
}

export async function saveCheckIn(userId, checkInData) {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Check if check-in already exists for today
    const existing = await db.checkIns
      .where('[userId+date]')
      .equals([userId, today])
      .first();

    if (existing) {
      // Update existing check-in
      await db.checkIns.update(existing.id, {
        ...checkInData,
        updatedAt: new Date().toISOString()
      });
      return existing.id;
    } else {
      // Create new check-in
      return await db.checkIns.add({
        userId,
        date: today,
        ...checkInData,
        createdAt: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error saving check-in:', error);
    throw error;
  }
}

export async function getCheckIns(userId, limit = 90) {
  try {
    return await db.checkIns
      .where('userId')
      .equals(userId)
      .reverse()
      .limit(limit)
      .toArray();
  } catch (error) {
    console.error('Error getting check-ins:', error);
    throw error;
  }
}

export async function getTodayCheckIn(userId) {
  try {
    const today = new Date().toISOString().split('T')[0];
    return await db.checkIns
      .where('[userId+date]')
      .equals([userId, today])
      .first();
  } catch (error) {
    console.error('Error getting today check-in:', error);
    return null;
  }
}

export async function saveMilestone(userId, type, data = {}) {
  try {
    return await db.milestones.add({
      userId,
      type,
      achievedAt: new Date().toISOString(),
      ...data
    });
  } catch (error) {
    console.error('Error saving milestone:', error);
    throw error;
  }
}

export async function getMilestones(userId) {
  try {
    return await db.milestones
      .where('userId')
      .equals(userId)
      .reverse()
      .toArray();
  } catch (error) {
    console.error('Error getting milestones:', error);
    throw error;
  }
}

export async function createPartnership(userId, partnerId, pairingCode, sharedData) {
  try {
    await db.partnerships.add({
      userId,
      partnerId,
      pairingCode,
      sharedData,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error creating partnership:', error);
    throw error;
  }
}

export async function getPartnership(userId) {
  try {
    return await db.partnerships.where('userId').equals(userId).first();
  } catch (error) {
    console.error('Error getting partnership:', error);
    return null;
  }
}

export async function findPartnershipByCode(code) {
  try {
    return await db.partnerships.where('pairingCode').equals(code).first();
  } catch (error) {
    console.error('Error finding partnership by code:', error);
    return null;
  }
}

export async function trackAnalytics(userId, event, data = {}) {
  try {
    await db.analytics.add({
      userId,
      event,
      timestamp: new Date().toISOString(),
      ...data
    });
  } catch (error) {
    console.error('Error tracking analytics:', error);
  }
}

export async function exportUserData(userId) {
  try {
    const user = await db.users.get(userId);
    const healthData = await db.healthData.where('userId').equals(userId).toArray();
    const checkIns = await db.checkIns.where('userId').equals(userId).toArray();
    const milestones = await db.milestones.where('userId').equals(userId).toArray();
    const partnership = await db.partnerships.where('userId').equals(userId).first();

    return {
      user,
      healthData,
      checkIns,
      milestones,
      partnership,
      exportedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error exporting user data:', error);
    throw error;
  }
}
