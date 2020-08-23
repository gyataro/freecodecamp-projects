import hashlib

def crack_sha1_hash(hash, use_salts = False):
  if use_salts:
    with open('known-salts.txt') as s:
      salts = s.read().splitlines()
  else:
    salts = ['']

  with open('top-10000-passwords.txt') as passwords:
    for password in passwords:
      password = password.rstrip('\n')

      for salt in salts:
        prepend_hash = hashlib.sha1(str(salt + password).encode('utf-8')).hexdigest()

        append_hash = hashlib.sha1(str(password + salt).encode('utf-8')).hexdigest()

        if prepend_hash == hash or append_hash == hash: return password
      
  return "PASSWORD NOT IN DATABASE"