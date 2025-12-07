import pkg from 'pg'
const { Client } = pkg

// Configuration (same as execute-migrations-final.mjs)
const config = {
    host: 'db.aozsrfvzutkamsnibtug.supabase.co',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'Action24aid#',
    ssl: { rejectUnauthorized: false }
}

async function runVerification() {
    console.log('🚀 Starting Thorough CRUD Verification...\n')
    const client = new Client(config)

    try {
        await client.connect()
        console.log('✅ Base de dados conectada')

        // 1. SETUP: Get Org and Create Test Patient
        console.log('\n--- SETUP ---')

        // Get Org
        const orgRes = await client.query('SELECT id FROM organizations LIMIT 1')
        if (orgRes.rows.length === 0) throw new Error('No organization found')
        const orgId = orgRes.rows[0].id
        console.log(`Organization ID: ${orgId}`)

        // Create Patient
        const patRes = await client.query(`
            INSERT INTO patients (organization_id, full_name, email, date_of_birth, gender)
            VALUES ($1, 'CRUD Tester', 'test@crud.com', '1990-01-01', 'male')
            RETURNING id
        `, [orgId])
        const patientId = patRes.rows[0].id
        console.log(`Test Patient Created: ${patientId}`)

        // 2. TEST CONSULTATIONS
        console.log('\n--- TESTING CONSULTATIONS ---')
        // Create
        const consRes = await client.query(`
            INSERT INTO patient_consultations (organization_id, patient_id, doctor_name, notes, date)
            VALUES ($1, $2, 'Dr. Test', 'Initial Note', NOW())
            RETURNING id
        `, [orgId, patientId])
        const consId = consRes.rows[0].id
        console.log(`[C] Created Consultation: ${consId}`)

        // Read
        const consRead = await client.query('SELECT * FROM patient_consultations WHERE id = $1', [consId])
        if (consRead.rows[0].notes !== 'Initial Note') throw new Error('Read failed: notes mismatch')
        console.log(`[R] Verified Consultation`)

        // Update
        await client.query('UPDATE patient_consultations SET notes = $1 WHERE id = $2', ['Updated Note', consId])
        const consUpdate = await client.query('SELECT notes FROM patient_consultations WHERE id = $1', [consId])
        if (consUpdate.rows[0].notes !== 'Updated Note') throw new Error('Update failed')
        console.log(`[U] Updated Consultation`)

        // Delete
        await client.query('DELETE FROM patient_consultations WHERE id = $1', [consId])
        const consDel = await client.query('SELECT * FROM patient_consultations WHERE id = $1', [consId])
        if (consDel.rows.length > 0) throw new Error('Delete failed')
        console.log(`[D] Deleted Consultation`)


        // 3. TEST DIET PLANS
        console.log('\n--- TESTING DIET PLANS ---')
        const day = 'monday'
        // Create
        await client.query(`
            INSERT INTO patient_diet_plans (organization_id, patient_id, day_of_week, meals)
            VALUES ($1, $2, $3, $4)
        `, [orgId, patientId, day, JSON.stringify([{ name: 'Test Meal' }])])
        console.log(`[C] Created Diet Plan for ${day}`)

        // Read
        const dietRead = await client.query('SELECT * FROM patient_diet_plans WHERE patient_id = $1 AND day_of_week = $2', [patientId, day])
        if (dietRead.rows.length === 0) throw new Error('Read Diet failed')
        console.log(`[R] Verified Diet Plan`)

        // Update
        await client.query(`
            UPDATE patient_diet_plans SET meals = $1 WHERE patient_id = $2 AND day_of_week = $3
        `, [JSON.stringify([{ name: 'Updated Meal' }]), patientId, day])
        const dietUpdate = await client.query('SELECT meals FROM patient_diet_plans WHERE patient_id = $1 AND day_of_week = $2', [patientId, day])
        if (dietUpdate.rows[0].meals[0].name !== 'Updated Meal') throw new Error('Update Diet failed')
        console.log(`[U] Updated Diet Plan`)

        // Delete
        await client.query('DELETE FROM patient_diet_plans WHERE patient_id = $1', [patientId])
        const dietDel = await client.query('SELECT * FROM patient_diet_plans WHERE patient_id = $1', [patientId])
        if (dietDel.rows.length > 0) throw new Error('Delete Diet failed')
        console.log(`[D] Deleted Diet Plan`)


        // 4. TEST DAILY LOGS
        console.log('\n--- TESTING DAILY LOGS ---')
        const date = '2025-01-01'
        // Create
        await client.query(`
            INSERT INTO patient_daily_logs (organization_id, patient_id, date, water_intake)
            VALUES ($1, $2, $3, 1000)
        `, [orgId, patientId, date])
        console.log(`[C] Created Daily Log for ${date}`)

        // Read
        const logRead = await client.query('SELECT * FROM patient_daily_logs WHERE patient_id = $1 AND date = $2', [patientId, date])
        if (parseInt(logRead.rows[0].water_intake) !== 1000) throw new Error('Read Log failed')
        console.log(`[R] Verified Daily Log`)

        // Update
        await client.query('UPDATE patient_daily_logs SET water_intake = 2000 WHERE patient_id = $1 AND date = $2', [patientId, date])
        const logUpdate = await client.query('SELECT water_intake FROM patient_daily_logs WHERE patient_id = $1 AND date = $2', [patientId, date])
        if (parseInt(logUpdate.rows[0].water_intake) !== 2000) throw new Error('Update Log failed')
        console.log(`[U] Updated Daily Log`)

        // Delete
        await client.query('DELETE FROM patient_daily_logs WHERE patient_id = $1', [patientId])
        console.log(`[D] Deleted Daily Log`)


        // 5. TEST ADHERENCE
        console.log('\n--- TESTING ADHERENCE ---')
        // Need a fake item ID (UUID)
        const fakeItemId = '00000000-0000-0000-0000-000000000001'
        // Create
        await client.query(`
            INSERT INTO patient_adherence_logs (organization_id, patient_id, date, item_id, item_type, status)
            VALUES ($1, $2, $3, $4, 'medication', 'pending')
        `, [orgId, patientId, date, fakeItemId])
        console.log(`[C] Created Adherence Log`)

        // Read
        const adhRead = await client.query('SELECT * FROM patient_adherence_logs WHERE patient_id = $1 AND item_id = $2', [patientId, fakeItemId])
        if (adhRead.rows[0].status !== 'pending') throw new Error('Read Adherence failed')
        console.log(`[R] Verified Adherence Log`)

        // Update
        await client.query('UPDATE patient_adherence_logs SET status = $1 WHERE patient_id = $2 AND item_id = $3', ['taken', patientId, fakeItemId])
        const adhUpdate = await client.query('SELECT status FROM patient_adherence_logs WHERE patient_id = $1 AND item_id = $2', [patientId, fakeItemId])
        if (adhUpdate.rows[0].status !== 'taken') throw new Error('Update Adherence failed')
        console.log(`[U] Updated Adherence Log`)

        // Delete
        await client.query('DELETE FROM patient_adherence_logs WHERE patient_id = $1', [patientId])
        console.log(`[D] Deleted Adherence Log`)


        // CLEANUP
        console.log('\n--- CLEANUP ---')
        await client.query('DELETE FROM patients WHERE id = $1', [patientId])
        console.log('✅ Test Patient Deleted')

        console.log('\n🎉 ALL TESTS PASSED! DATABASE CRUD IS FULLY OPERATIONAL.')

    } catch (error) {
        console.error('\n❌ VERIFICATION FAILED:', error)
    } finally {
        await client.end()
    }
}

runVerification()
