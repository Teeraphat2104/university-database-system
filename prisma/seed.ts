import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import { writeFileSync, mkdirSync, existsSync } from "fs"
import path from "path"
import { put } from "@vercel/blob"

const prisma = new PrismaClient()

const SETTINGS_DEFAULTS: Record<string, string> = {
  siteName: "University DB",
  siteDescription: "Browse and search the university archive of PDF documents, organized by category, year, and month.",
  footerText: "University Database System",
  maxFileSizeMB: "10",
  allowedFileTypes: ".pdf,.doc,.docx",
  contactEmail: "",
  contactPhone: "",
  aboutText: "",
  address: "",
  facebookLink: "",
  lineId: "",
  mapEmbedUrl: "",
  heroTitle: "University Database System",
  heroSubtitle: "Browse and search the university\u2019s archive of PDF documents, organized by category, year, and month.",
  heroTitleHighlight: "Database",
}

const CATEGORIES = [
  { name: "งานวิจัย", slug: "research-papers" },
  { name: "วิทยานิพนธ์", slug: "thesis" },
  { name: "หลักสูตร", slug: "curriculum" },
  { name: "เอกสารบริหาร", slug: "administrative" },
  { name: "ปฏิทินการศึกษา", slug: "academic-calendar" },
  { name: "ประกาศ", slug: "announcements" },
  { name: "รายงานการประชุม", slug: "meeting-minutes" },
  { name: "เอกสารการเงิน", slug: "financial" },
  { name: "ตำราเรียน", slug: "textbooks" },
  { name: "กิจกรรมนักศึกษา", slug: "student-activities" },
  { name: "แผนปฏิบัติการ", slug: "action-plans" },
  { name: "อื่นๆ", slug: "other" },
]

const PDF_TEMPLATES: Array<{
  title: string
  slug: string
  year: number
  month: number
}> = [
  { title: "รายงานการวิจัย ประจำปี 2567", slug: "research-papers", year: 2024, month: 11 },
  { title: "การพัฒนาหลักสูตรวิศวกรรมศาสตร์ 2568", slug: "curriculum", year: 2025, month: 3 },
  { title: "วิทยานิพนธ์ เรื่อง ปัญญาประดิษฐ์เพื่อการศึกษา", slug: "thesis", year: 2024, month: 6 },
  { title: "ระเบียบการเงินและพัสดุ ฉบับปรับปรุง 2567", slug: "financial", year: 2024, month: 8 },
  { title: "ปฏิทินการศึกษา ภาคต้น ปีการศึกษา 2568", slug: "academic-calendar", year: 2025, month: 5 },
  { title: "ประกาศรับสมัครบุคลากรสายวิชาการ 2568", slug: "announcements", year: 2025, month: 1 },
  { title: "รายงานการประชุมสภาคณาจารย์ ครั้งที่ 3/2567", slug: "meeting-minutes", year: 2024, month: 9 },
  { title: "แผนปฏิบัติการประจำปี 2568", slug: "action-plans", year: 2025, month: 1 },
  { title: "ตำราวิชาการวิจัยดำเนินงาน", slug: "textbooks", year: 2023, month: 5 },
  { title: "โครงการค่ายอาสาพัฒนาชนบท 2567", slug: "student-activities", year: 2024, month: 10 },
  { title: "รายงานการวิจัย เรื่อง การเรียนรู้ของเครื่อง", slug: "research-papers", year: 2025, month: 2 },
  { title: "วิทยานิพนธ์ เรื่อง การออกแบบฐานข้อมูล", slug: "thesis", year: 2023, month: 12 },
  { title: "ประกาศผลการคัดเลือกบุคคลเข้าศึกษา 2568", slug: "announcements", year: 2025, month: 4 },
  { title: "รายงานการประชุมคณะกรรมการบริหาร ครั้งที่ 1/2568", slug: "meeting-minutes", year: 2025, month: 2 },
  { title: "แผนงบประมาณ ประจำปีงบประมาณ 2569", slug: "financial", year: 2025, month: 9 },
  { title: "หลักสูตรระดับบัณฑิตศึกษา พ.ศ. 2567", slug: "curriculum", year: 2024, month: 7 },
  { title: "ปฏิทินการศึกษา ภาคปลาย ปีการศึกษา 2567", slug: "academic-calendar", year: 2024, month: 10 },
  { title: "คู่มือนักศึกษาใหม่ ปีการศึกษา 2568", slug: "other", year: 2025, month: 5 },
  { title: "รายงานผลการดำเนินงานโครงการปี 2567", slug: "action-plans", year: 2024, month: 12 },
  { title: "ตำราเรียนการเขียนโปรแกรมภาษา Python", slug: "textbooks", year: 2024, month: 3 },
  { title: "โครงการแข่งขันวิชาการระดับชาติ 2568", slug: "student-activities", year: 2025, month: 6 },
  { title: "บันทึกข้อตกลงความร่วมมือทางวิชาการ 2567", slug: "administrative", year: 2024, month: 5 },
  { title: "เอกสารประกอบการประชุมปฐมนิเทศ 2568", slug: "administrative", year: 2025, month: 5 },
  { title: "วิทยานิพนธ์ เรื่อง ระบบจัดการเอกสารอัจฉริยะ", slug: "thesis", year: 2025, month: 1 },
]

async function main() {
  console.log("Seeding users...")
  const hashedPassword = await bcrypt.hash("admin123", 12)

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@university.edu" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@university.edu",
      hashedPassword,
      role: "admin",
    },
  })

  await prisma.user.upsert({
    where: { email: "editor@university.edu" },
    update: {},
    create: {
      name: "Editor",
      email: "editor@university.edu",
      hashedPassword,
      role: "editor",
    },
  })

  console.log("Seeding settings...")
  for (const [key, value] of Object.entries(SETTINGS_DEFAULTS)) {
    await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    })
  }

  console.log("Seeding categories...")
  await prisma.pdf.deleteMany()
  await prisma.category.deleteMany()

  const createdCategories: Record<string, string> = {}
  for (const cat of CATEGORIES) {
    const created = await prisma.category.create({
      data: { name: cat.name, slug: cat.slug },
    })
    createdCategories[cat.slug] = created.id
  }

  const MINIMAL_PDF = Buffer.from(
    "%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R>>endobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n190\n%%EOF",
  )

  console.log("Seeding PDFs...")
  const useBlob = !!process.env.BLOB_READ_WRITE_TOKEN
  const uploadDir = path.join(__dirname, "..", "uploads")
  if (!useBlob) {
    mkdirSync(uploadDir, { recursive: true })
  }

  const pdfData = await Promise.all(
    PDF_TEMPLATES.map(async (pdf) => {
      const categoryId = createdCategories[pdf.slug]
      if (!categoryId) throw new Error(`Category not found for slug: ${pdf.slug}`)
      const createdAt = new Date(pdf.year, pdf.month - 1, 1)
      const filename = `${crypto.randomUUID()}.pdf`

      let filePath: string
      if (useBlob) {
        const blob = await put(filename, MINIMAL_PDF, {
          access: "public",
          contentType: "application/pdf",
        })
        filePath = blob.url
      } else {
        const pdfPath = path.join(uploadDir, filename)
        if (!existsSync(pdfPath)) {
          writeFileSync(pdfPath, MINIMAL_PDF)
        }
        filePath = filename
      }

      return {
        title: pdf.title,
        description: `Seed data — ${pdf.title}`,
        year: pdf.year,
        month: pdf.month,
        filePath,
        originalName: `${pdf.title}.pdf`,
        fileSize: Math.floor(Math.random() * 2000000) + 100000,
        uploadedById: adminUser.id,
        categoryId,
        createdAt,
      }
    }),
  )

  for (const pdf of pdfData) {
    await prisma.pdf.create({ data: pdf })
  }

  console.log("\nSeed complete!")
  console.log(`  • 2 users (admin / editor) — password: admin123`)
  console.log(`  • ${Object.keys(SETTINGS_DEFAULTS).length} settings`)
  console.log(`  • ${CATEGORIES.length} categories`)
  console.log(`  • ${pdfData.length} PDFs`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
