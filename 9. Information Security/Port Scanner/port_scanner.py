import socket

def get_open_ports(target, port_range, verbose = False):
  open_ports = []

  try:
    ip_addr = socket.gethostbyname(target)
  except:
    if target.replace('.', '').isnumeric():
      return "Error: Invalid IP address"
    else:
      return "Error: Invalid hostname"

  try:
    hostname = socket.gethostbyaddr(ip_addr)[0]
    no_host = False
  except:
    no_host = True

  for i in range(port_range[0], port_range[1] + 1):
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(2)

    if s.connect_ex((str(ip_addr), i)) == 0:
      open_ports.append(i)
    
    s.close()
  
  if verbose:
    if no_host:
      output = "Open ports for {IP}\nPORT     SERVICE".format(IP=ip_addr)
    else:
      output = "Open ports for {URL} ({IP})\nPORT     SERVICE".format(URL=hostname, IP=ip_addr)
    
    for i in open_ports:
      output += "\n{PORT}{SERVICE}".format(PORT=str(i).ljust(9), SERVICE=socket.getservbyport(i))
    
    return(output)

  else:
    return(open_ports)