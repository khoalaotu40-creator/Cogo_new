import re

with open('server/api/users.ts', 'r') as f:
    content = f.read()

old_catch = """  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }"""

new_catch = """  } catch (error: any) {
    console.error("Error updating user:", error.message || error);
    res.status(500).json({ error: "Internal server error", details: error.message || String(error) });
  }"""

content = content.replace(old_catch, new_catch)

with open('server/api/users.ts', 'w') as f:
    f.write(content)
