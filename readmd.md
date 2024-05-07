# docker run --name bcknd_postgres -e POSTGRES_PASSWORD=senha -p 5432:5432 -d postgres #
# docker build -t rntsza/bcknd . #
# docker run -p 3000:3000 rntsza/bcknd #

# Create a migration from changes in Prisma schema, apply it to the database, trigger generators (e.g. Prisma Client) #
# npx prisma migrate dev # 

# Apply pending migrations to the database in production/staging # 
# prisma migrate deploy # 

# Create a migration # 
# npx prisma migrate dev --name nome #